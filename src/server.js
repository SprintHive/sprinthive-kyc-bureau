const {Subject} = require("rxjs");

const rabbitConnection$ = require("./connectToRabbit");
const {listForRabbitMessages} = require("./messageConsumer");
const {bureauService} = require("./bureauService");
const {sendSuccessMessagesToRabbit, sendNoDataMessagesToRabbit, sendErrorMessagesToRabbit} = require("./messageProducer");

const deps = {rabbitConnection$};
const action$ = new Subject();
action$.ofType = (filterType) => action$.filter(action => action.type === filterType);

const epics = [
  listForRabbitMessages,
  bureauService,
  sendSuccessMessagesToRabbit,
  sendNoDataMessagesToRabbit,
  sendErrorMessagesToRabbit
];

epics.forEach(e =>
  e(action$, deps)
    .filter(action => action.type)
    .subscribe(action => action$.next(action)));