export const name = 'sample.webview-clock'

export const test = async ({ Extension, Main }) => {
  // TODO open sample webview
  // TODO verify that expected content is displayed
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Main.openUri('webview://xyz')
}
