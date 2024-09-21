export const name = 'sample.webview-provider'

export const test = async ({ Extension, Main, FileSystem }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  // TODO open sample webview
  // TODO verify that expected content is displayed
}
