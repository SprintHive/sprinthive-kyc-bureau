const logAction = action => {
  if (action.payload.individualVerificationRequest
    && action.payload.individualVerificationRequest
    && action.payload.individualVerificationRequest.individualVerificationId) {
    console.log(`Processing action type: ${action.type} individualVerificationId: ${action.payload.individualVerificationRequest.individualVerificationId}`)
  } else {
    console.log(`Processing action type: ${action.type}`)
  }
};

module.exports = {logAction};