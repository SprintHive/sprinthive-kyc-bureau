require('dotenv').config();
const {Observable} = require("rxjs");
const amqp = require('amqplib');

const rabbitUrl = process.env.rabbitUrl || 'amqp://user:guest@rabbitmq/';

const createChannel = (conn) =>
  Observable.fromPromise(conn.createChannel())
    .mergeMap(ch => Observable.of({conn, ch}));

const rabbitConnection = Observable.fromPromise(amqp.connect(rabbitUrl))
  .mergeMap(createChannel)
  .shareReplay(1);

module.exports = rabbitConnection;
