export const name = 'sample.webview-dynamic'

export const test = async ({ Extension, Main }) => {
  // TODO open sample webview
  // TODO verify that expected content is displayed
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri('webview://xyz')
}
