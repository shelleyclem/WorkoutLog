const router = require('express').Router();
const { UniqueConstraintError } = require('sequelize/lib/errors');
const{ UserModel } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    let { username, password } = req.body.user;
    try {
        let User = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn 60 * 60 * 24});

        res.status(201).json({
            mesage: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user"
            });
        }
    }
});

module.exports = router;