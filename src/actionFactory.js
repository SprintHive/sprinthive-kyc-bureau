const INDIVIDUAL_PROFILE_REQUEST_RECEIVED = "INDIVIDUAL_PROFILE_REQUEST_RECEIVED";
const individualProfileRequestReceived = ({individualVerificationRequest, nack, ack}) =>
  ({type: INDIVIDUAL_PROFILE_REQUEST_RECEIVED, payload: {individualVerificationRequest}, nack, ack});

const SEND_SUCCESS_MESSAGE_TO_RABBIT = "SEND_SUCCESS_MESSAGE_TO_RABBIT";
const sendSuccessMessageToRabbit = ({payload, nack, ack}) =>
  ({type: SEND_SUCCESS_MESSAGE_TO_RABBIT, payload, nack, ack});

const SEND_NO_DATA_MESSAGE_TO_RABBIT = "SEND_NO_DATA_MESSAGE_TO_RABBIT";
const sendNoDataMessageToRabbit = ({payload, nack, ack}) =>
  ({type: SEND_NO_DATA_MESSAGE_TO_RABBIT, payload, nack, ack});

const SEND_ERROR_MESSAGE_TO_RABBIT = "SEND_ERROR_MESSAGE_TO_RABBIT";
const sendErrorMessageToRabbit = ({payload, nack, ack}) =>
  ({type: SEND_ERROR_MESSAGE_TO_RABBIT, payload, nack, ack});

module.exports = {
  INDIVIDUAL_PROFILE_REQUEST_RECEIVED, individualProfileRequestReceived,
  SEND_SUCCESS_MESSAGE_TO_RABBIT, sendSuccessMessageToRabbit,
  SEND_NO_DATA_MESSAGE_TO_RABBIT, sendNoDataMessageToRabbit,
  SEND_ERROR_MESSAGE_TO_RABBIT, sendErrorMessageToRabbit
};
