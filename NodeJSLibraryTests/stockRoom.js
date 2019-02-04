// https://www.npmjs.com/package/stockroom

import createStore from 'stockroom'
import StoreWorker from 'worker-loader!./worker'
 
let store = createStore(new StoreWorker())
 
let increment = store.action('increment')
store.subscribe(console.log)
 
// Let's run a registered "increment" action in the worker.
// This will eventually log a state update to the console - `{ count: 1 }`
increment()