export const name = 'sample.webview-provider-modern-to-have-class'

export const test = async ({ Extension, Main, FileSystem, WebView, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  const webView = await WebView.fromId('xyz')
  const body = webView.locator('body')
  await expect(body).toHaveClass('abc')
}
