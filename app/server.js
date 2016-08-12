import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './router';

// initialize
const app = express();

// database setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/3fp';
mongoose.connect(mongoURI);

// set mongoose promises to default (es6)
mongoose.Promise = global.Promise;

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// register our routes
app.use('/api', apiRouter);

// default index route
// app.get('/', (req, res) => {
//   res.send('hi');
// });

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
