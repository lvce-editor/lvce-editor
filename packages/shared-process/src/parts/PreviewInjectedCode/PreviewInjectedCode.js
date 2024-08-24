export const injectedCode = `
let commandMap = {}
let port
const callbacks = Object.create(null)

const isJsonRpcResponse = message => {
  return 'result' in message || 'error' in message
}

const handleMessage = async (event) => {
  const message = event.data
  if(isJsonRpcResponse(message)){
    const fn = callbacks[message.id]
    fn(message.result)
    return
  }
  const { method, params } = message
  const fn = commandMap[method]
  if(!fn){
    throw new Error("command not found \${method}")
  }
  const result = await fn(...params)
}

const handleWindowMessage = (event) => {
  const { data } = event
  const { params } = data
  const _port = params[0]
  const type = params[1]
  console.log(data)
  if(type === 'test'){
    // TODO handle test port
    console.log('handle test port')
  } else {
    // TODO handle application port
    port = _port
    port.onmessage = handleMessage
    port.postMessage('ready')
  }
}

window.addEventListener('message', handleWindowMessage)

const withResolvers = () => {
  let _resolve
  const promise = new Promise(resolve => {
    _resolve = resolve
  })
  return {
    resolve: _resolve,
    promise
  }
}

const registerPromise = () => {
  const id = 1
  const {resolve, promise} = withResolvers()
  callbacks[id] = { resolve }
  return {
    id, promise
  }
}

globalThis.lvceRpc = (value) => {
  commandMap = value
  return {
    async invoke(method, ...params){
      const {id, promise } = registerPromise()
      port.postMessage({
        jsonrpc: '2.0',
        id,
        method,
        params
      })
      const response = await promise
      // TODO unwrap jsonrpc result
      return response
    }
  }
}
`
