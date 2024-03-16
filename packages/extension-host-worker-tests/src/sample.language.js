export const name = 'sample.language'

export const test = async ({ FileSystem, Workspace, Extension, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.language', import.meta.url).toString())

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  const token = Locator('.Token')
  await expect(token).toHaveClass('Xyz')
}
