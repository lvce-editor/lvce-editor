const create = async ({ port }) => {
  await port.invoke('setCss', 'color', 'green')
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
