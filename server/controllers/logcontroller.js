const Express = require('express');
const router = Express.Router();
let validateJWT = require('../middleware/validate-jwt');

//Import Log Model: 
const { LogModel } = require('../models');
const Log = require('../models/log');

