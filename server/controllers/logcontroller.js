const Express = require('express');
const router = Express.Router();
let validateJWT = require('../middleware/validate-jwt');

//Import Log Model: 
const { LogModel, logModel } = require('../models');
const Log = require('../models/log');

/*

=====================
    Create Log
=====================

*/

router.post('/log', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const workoutLog = {
        description, 
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(workoutLog);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({err: err});
    }
    LogModel.create(workoutLog)
});


/*

=====================
   Get Logs by User
=====================

*/

router.get('/log', async (req, res) => {
    try {
        const logs = await LogModel.findAll();
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({err: err});
    }
});


/*

=====================
    Get Logs by ID
=====================

*/
// router.get('/log/:id', async (req, res) => {

// })
/*

=====================
    Update Logs
=====================

*/

router.put('/log/:id', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logID = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logID,
            owner: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({err: err});
    }
});

/*

=====================
    Delete Logs
=====================

*/


router.delete('/log/:id', async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({mesage: 'Log entry removed'});
    } catch (err) {
        res.status(500).json({err: err});
    }
});

module.exports = router;