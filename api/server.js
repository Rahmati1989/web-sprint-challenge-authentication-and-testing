const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();
const sessionConfig = {
    name:'a-session',
    secret: "Rafi, It is Safe",
    cookie:{
        maxAge: 60 * 60 * 2000,
        secure: false ,
        httpOnly: true
    },
    resave: true,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: require('../data/dbConfig'),
        table: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        
    })
}

server.use(session(sessionConfig));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

module.exports = server;
