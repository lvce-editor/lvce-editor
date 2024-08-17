export const skip = true

export const name = 'sample.webview-provider'

export const test = async ({ Extension }) => {
  // TODO open sample webview
  // TODO verify that expected content is displayed
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
}
