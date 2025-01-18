export const name = 'sample.webview-provider'

export const skip = true

export const test = async ({ Extension, Main, FileSystem, WebView }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  const webView = await WebView.fromId('xyz')
  console.log({ webview: webView })
  const heading = webView.locator('h1')
  // TODO allow using normal expect function for webview also
  await webView.expect(heading).toBeVisible()
  await webView.expect(heading).toHaveText('Hello world')
  // TODO open sample webview
  // TODO verify that expected content is displayed
}
