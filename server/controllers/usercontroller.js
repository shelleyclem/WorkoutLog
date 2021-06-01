const router = require('express').Router();
const { UniqueConstraintError } = require('sequelize/lib/errors');
const{ UserModel } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/user/register', async (req, res) => {
    let { username, password } = req.body.user;
    try {
        let User = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

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

router.post('/user/login', async (req, res) => {
    let {username, password} = req.body.user;
    
    try {
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });
        
        if (loginUser)  {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);
            if (passwordComparison) {
                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token 
                });

            } else {
                res.status(401).json({
                    message: "Incorrect username or password"})
            }

        } else {
            res.status(401).json({
                message: 'Incorrect username or password'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to log in user"
        })
    }
});

module.exports = router;