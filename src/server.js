const {Subject, Observable} = require("rxjs");

const {listForRabbitMessages} = require("./messageConsumer");
const {bureauService} = require("./bureauService");
const {sendSuccessMessagesToRabbit, sendNoDataMessagesToRabbit, sendErrorMessagesToRabbit} = require("./messageProducer");

const {logAction} = require("./utils");


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
  e(action$)
    .filter(action => action.type)
    .subscribe(action => action$.next(action)));




/*
listForRabbitMessages()
  .mergeMap(action => {
    const action$ = new BehaviorSubject(action);
    action$.ofType = (filterType) => action$.filter(action => action.type === filterType);

    const epics = [
      bureauService,
    ];

    return Observable.from(epics)
      .mergeMap(epic => epic(action$))
      .filter(action => action.type)
      .do(action => action$.next(action));
  })
  .subscribe(() => "next");*/

/*
const eventBus = new Subject();
listForRabbitMessages(eventBus);
bureauService(eventBus);
sendMessagesToRabbit(eventBus);
*/

/*
eventBus.subscribe(
  action => console.log(`Processed ${action.type}`),
  error => console.error(error),
  () => console.info("Complete")
);
*/

/*
const test1 = (action$) => {
  return action$
    .ofType("TEST1")
    .do(logAction)
    .mergeMap(() => Observable.of({type: "TEST2"}))
};

const test2 = (action$) => {
  return action$
    .ofType("TEST2")
    .do(logAction)
    .mergeMap(() => Observable.of({type: "TEST3"}))
};

const action$ = new Subject();
action$.ofType = (filterType) => action$.filter(action => action.type === filterType);

const epics = [
  bureauService,
];

epics.forEach(e =>
  e(action$)
    .filter(action => action.type)
    .subscribe(action => action$.next(action)));

// simulate something from the queue
action$.next({type: "TEST1"});*/
