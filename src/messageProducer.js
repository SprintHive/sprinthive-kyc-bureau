require('dotenv').config();
const amqp = require('amqplib/callback_api');
const {Observable} = require("rxjs");

const {SEND_SUCCESS_MESSAGE_TO_RABBIT, SEND_NO_DATA_MESSAGE_TO_RABBIT, SEND_ERROR_MESSAGE_TO_RABBIT} = require("./actionFactory");

let channel;
const rabbitUrl = process.env.rabbitUrl || 'amqp://user:guest@rabbitmq/';
const exchangeName = "individual-profile-complete";
console.log(`Connecting to ${rabbitUrl} exchange: ${exchangeName}`);
amqp.connect(rabbitUrl, function (err, conn) {
  console.log("Connected!");
  if (err) {
    console.error(err);
  } else {
    conn.createChannel(function (err, ch) {
      ch.assertExchange(exchangeName, 'topic', {durable: true});
      channel = ch;
    });
  }
});

const getMiddleNames = (ConsumerDetail) => {
  if (ConsumerDetail.SecondName) {
    if (ConsumerDetail.ThirdName) {
      return `${ConsumerDetail.SecondName} ${ConsumerDetail.ThirdName}`
    } else {
      return ConsumerDetail.SecondName
    }
  }
};

const sendSuccessMessagesToRabbit = (action$) => {
  return action$
    .ofType(SEND_SUCCESS_MESSAGE_TO_RABBIT)
    .do(action => {
      console.log("Sending a message to success queue", action.payload);
      const {bureauResult, individualVerificationRequest} = action.payload;
      const {individualVerificationId, identityType} = individualVerificationRequest;
      const {Consumer} = bureauResult.payload;
      const {ConsumerDetail, ConsumerFraudIndicatorsSummary} = Consumer;
      const data = {
        individualVerificationId,
        dataProviderResponseDate: new Date(),
        dataProvider: "SPRINTHIVE_BUREAU",
        dataSubProvider: "NONE",
        dateVerifiedWithHomeAffairs: new Date(),
        verifiedWithHomeAffairs: true,
        dataProviderRequestId: Consumer.ReportInformation.ReportId,
        individualProfile: {
          identityType,
          providerIdentifyingNumber: ConsumerDetail.IDNo,
          alternateProviderIdentifyingNumber: "",
          firstName: ConsumerDetail.FirstName,
          middleNames: getMiddleNames(ConsumerDetail),
          dateOfBirth: ConsumerDetail.BirthDate,
          deceased: ConsumerFraudIndicatorsSummary.HomeAffairsDeceasedStatus === "Yes",
          verifiedWithHomeAffairs: ConsumerFraudIndicatorsSummary.HomeAffairsVerificationYN === "Yes"
        }
      };

      channel.publish(exchangeName, "success", new Buffer(JSON.stringify(data)));
      action.ack();
    })
    .mergeMap(() => Observable.empty());
};

const sendNoDataMessagesToRabbit = (action$) => {
  return action$
    .ofType(SEND_NO_DATA_MESSAGE_TO_RABBIT)
    .do(action => {
      console.log("Sending a message to no-data queue");
      const {individualVerificationRequest} = action.payload;
      const {individualVerificationId} = individualVerificationRequest;

      const data = {
        dataProvider: "SPRINTHIVE_BUREAU",
        dataSubProvider: "NONE",
        individualVerificationId,
      };

      channel.publish(exchangeName, "no-data", new Buffer(JSON.stringify(data)));
      action.ack();
    })
    .mergeMap(() => Observable.empty());
};

const sendErrorMessagesToRabbit = (action$) => {
  return action$
    .ofType(SEND_ERROR_MESSAGE_TO_RABBIT)
    .do(action => {
      console.log("Sending a message to error queue");
      const {individualVerificationRequest} = action.payload;
      const {individualVerificationId} = individualVerificationRequest;

      const data = {
        dataProvider: "SPRINTHIVE_BUREAU",
        dataSubProvider: "NONE",
        individualVerificationId,
        errorMessage: "The streams got crossed, never cross the streams!"
      };

      channel.publish(exchangeName, "error", new Buffer(JSON.stringify(data)));
      action.ack();
    })
    .mergeMap(() => Observable.empty());
};

module.exports = {sendSuccessMessagesToRabbit, sendNoDataMessagesToRabbit, sendErrorMessagesToRabbit};