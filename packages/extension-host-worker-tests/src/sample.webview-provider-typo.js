export const name = 'sample.webview-provider-typo'

export const test = async ({ Extension, Main, FileSystem }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  // TODO improve error message
  await Main.shouldHaveError('Error: webview provider xyz not found')
}
