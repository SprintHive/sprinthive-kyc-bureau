require('dotenv').config();
const axios = require("axios");
const {Observable} = require("rxjs");
const {logAction} = require("./utils");

const {INDIVIDUAL_PROFILE_REQUEST_RECEIVED, sendSuccessMessageToRabbit, sendNoDataMessageToRabbit,
  sendErrorMessageToRabbit} = require("./actionFactory");

const bureauEndpoint = process.env.bureauUrl || "http://sprinthive-bureau-v1";
const callBureau = (action) => {
  const {individualVerificationRequest} = action.payload;
  return Observable.of(individualVerificationRequest)
    .mergeMap(({identifyingNumber}) =>
      Observable.fromPromise(axios.get(`${bureauEndpoint}/v1/idNumber/${identifyingNumber}`))
        .mergeMap(({status, data, config}) => {
          console.log(`Got the result back from bureau call url: ${config.url}`);
          action.payload.bureauResult = {status, payload: data};
          return Observable.of(action);
        })
        .catch(error => {
          console.error("Got an error calling the bureau");
          console.error(error);
          if (error.response) {
            const {status, data} = error.response;
            action.payload.bureauResult = {status, payload: data, error};
            return Observable.of(action);
          } else {
            action.payload.bureauResult = {status: 503, error};
            return Observable.of(action);
          }
        })
    );
};

const bureauService = (action$) => {
  return action$
    .ofType(INDIVIDUAL_PROFILE_REQUEST_RECEIVED)
    .do(logAction)
    .mergeMap(callBureau)
    .mergeMap(action => {
      const {individualVerificationRequest, bureauResult} = action.payload;
      switch (bureauResult.status) {
        case 200 :
          return Observable.of(sendSuccessMessageToRabbit({payload: {individualVerificationRequest, bureauResult}, nack: action.nack, ack: action.ack}));

        case 404 :
          return Observable.of(sendNoDataMessageToRabbit({payload: {individualVerificationRequest, bureauResult}, nack: action.nack, ack: action.ack}));

        default:
          return Observable.of(sendErrorMessageToRabbit({payload: {individualVerificationRequest, bureauResult}, nack: action.nack, ack: action.ack}));
      }
    })
};

module.exports = {bureauService};