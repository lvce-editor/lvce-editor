export const name = 'sample.hover-provider'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, ['line', ''].join('\n'))

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.hover-provider', import.meta.url).toString())

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openHover()
}
