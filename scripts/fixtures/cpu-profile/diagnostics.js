import { WebWorkerRpcClient } from '@lvce-editor/rpc'

let rpc
const provideDiagnostics = async (document) => {
  if (!document.text.includes('cpu-profile-acceptance')) throw new Error('Unexpected document opened')
  const uris = await rpc.invoke('Extensions.executeCommand', 'GetActiveEditor.getOpenEditorUris')
  if (uris.length !== 1 || uris[0] !== document.uri) throw new Error('Unexpected restored editors')
  if (document.text.includes('provider-timeout')) await new Promise(() => {})
  const delay = document.text.includes('provider-slow') ? 31_000 : 250
  await new Promise((resolve) => setTimeout(resolve, delay))
  if (document.text.includes('provider-error')) throw new Error('CPU profile acceptance provider error')
  function cpuProfileDiagnosticWork() {
    const until = performance.now() + 200
    while (performance.now() < until) Math.sqrt(Math.random())
  }
  cpuProfileDiagnosticWork()
  return []
}
rpc = await WebWorkerRpcClient.create({ commandMap: { 'ExtensionApi.executeDiagnosticProvider': provideDiagnostics } })
