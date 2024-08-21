export const name = 'sample.webview-dynamic'

export const test = async ({ Extension, Main, WebView }) => {
  // TODO open sample webview
  // TODO verify that expected content is displayed
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri('webview://xyz')

  const webView = await WebView.fromId('xyz')
  const button = webView.locator('button')
  await webView.expect(button).toHaveText('0')
  await button.click()
  await webView.expect(button).toHaveText('1')
}
