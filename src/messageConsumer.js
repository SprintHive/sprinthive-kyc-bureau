require('dotenv').config();
const {Subject} = require("rxjs");

const {individualProfileRequestReceived} = require("./actionFactory");


const listForRabbitMessages = (action$, {rabbitConnection$}) => {
  const exchangeName = 'individual-profile-request';
  const queueName = 'individual-profile-request.sprinthive-kyc-bureau';

  return rabbitConnection$
    .do(({ch}) => ch.assertExchange(exchangeName, 'topic', {durable: true}))
    .do(({ch}) => ch.bindQueue(queueName, exchangeName, "attempt-0"))
    .mergeMap(({ch}) => {
      const eventBus = new Subject();
      ch.consume(queueName, function (msg) {
        const individualVerificationRequest = JSON.parse(msg.content.toString());
        const {individualVerificationId} = individualVerificationRequest;
        console.info(`Received an individual request from the queue individualVerificationId: ${individualVerificationId}`);
        eventBus.next(individualProfileRequestReceived({
          individualVerificationRequest,
          nack: () => {
            console.info(`Message has been nacked (putting it back onto the queue) individualVerificationId: ${individualVerificationId}`);
            ch.nack(msg, false, true)
          },
          ack: () => {
            console.info(`Message has been acked (processed successfully) individualVerificationId: ${individualVerificationId}`);
            ch.ack(msg);
          }
        }))
      }, {noAck: false});

      return eventBus;
    })
};

module.exports = {listForRabbitMessages};