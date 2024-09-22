export const name = 'sample.webview-provider-not-found'

export const skip = true

export const test = async ({ Extension, Main, FileSystem, ...rest }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)

  console.log({ rest })
  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  await Main.shouldHaveError('Error: webview provider xyz not found')
  const errorMessage = Locator('Viewlet Error')
  // TODO open sample webview
  // TODO verify that expected content is displayed
}
