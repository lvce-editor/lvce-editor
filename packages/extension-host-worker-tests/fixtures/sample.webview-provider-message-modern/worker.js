const create = async ({ port }) => {
  // TODO
  const count = await port.invoke('getCount')
  const newCount = count + 1
  await port.invoke('setCount', newCount)
}

const commands = {
  'WebView.create': create,
}

const main = async () => {
  const uri = '/packages/renderer-worker/node_modules/@lvce-editor/extension-host-sub-worker/dist/extensionHostSubWorkerMainApi.js'
  const { listen, commandMap } = await import(uri)
  await listen({ ...commandMap, ...commands })
}

main()
