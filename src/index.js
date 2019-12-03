import 'babel-polyfill';
import http from 'http';
import express from 'express';
import validate from 'express-validation';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import response from './api/concerns/response';
import permission from './lib/permission';
import Raven from 'raven';
import { formatValidationErrors } from './errors/handlers';

const path = require('path');
global.appRoot = path.resolve(__dirname, "../");

Raven.config(config.sentryDSN).install();

let app = express();
app.server = http.createServer(app);

app.use(Raven.requestHandler());

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));
app.use(bodyParser.urlencoded({
	extended: false
}));

// connect to db
initializeDb( db => {
	require('./lib/passport');
  app.set('permission', permission);

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

  app.use(function(req, res, next){
    res.status(404).json(response(null).error('Not found'));
  });

  app.use(function(err, req, res, next) {
    if (err instanceof validate.ValidationError) {
			return response(res).error(formatValidationErrors(err.errors));
    }

    Raven.captureException(err);
    res.status(500).json(response(null).error('Internal server error'));
  });

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
