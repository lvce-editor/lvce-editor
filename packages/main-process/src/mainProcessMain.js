// @ts-ignore
performance.mark('code/start')
// TODO figure out whether logging slows down startup time
require('./logging.js') // must be first import
const App = require('./parts/App/App.js')

const main = () => {
  App.hydrate()
}

main()
