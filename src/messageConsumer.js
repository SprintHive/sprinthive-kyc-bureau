require('dotenv').config();
const amqp = require('amqplib/callback_api');
const {Subject} = require("rxjs");

const {individualProfileRequestReceived} = require("./actionFactory");


const listForRabbitMessages = () => {
  const eventBus = new Subject();
  const rabbitUrl = process.env.rabbitUrl || 'amqp://user:guest@rabbitmq/';
  console.log(`Connecting to ${rabbitUrl}`);
  amqp.connect(rabbitUrl, function (err, conn) {
    console.log("Connected!");
    if (err) {
      console.error(err);
    } else {
      conn.createChannel(function (err, ch) {
        const exchangeName = 'individual-profile-request';
        const queueName = 'individual-profile-request.sprinthive-kyc-bureau';
        ch.assertExchange(exchangeName, 'topic', {durable: true});
        ch.assertQueue(queueName, {durable: false});
        ch.bindQueue(queueName, exchangeName, "attempt-0");
        ch.consume(queueName, function (msg) {
          console.info("Received an individual request from the queue");

          eventBus.next(individualProfileRequestReceived({
            individualVerificationRequest: JSON.parse(msg.content.toString()),
            nack: () => {
              console.info("Message has been nacked (putting it back onto the queue)");
              ch.nack(msg, false, true)
            },
            ack: () => {
              console.info("Message has been acked (processed successfully)");
              ch.ack(msg);
            }
          }))
        }, {noAck: false});
      });
    }
  });

  return eventBus
};

module.exports = {listForRabbitMessages};