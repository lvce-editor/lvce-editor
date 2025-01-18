export const name = 'sample.icon-theme-error-no-file-names'

export const test = async ({ FileSystem, Workspace, Extension, IconTheme }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await FileSystem.mkdir(`${tmpDir}/test-folder`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.icon-theme-error-no-file-names', import.meta.url).toString())

  // act
  await IconTheme.setIconTheme('test-icon-theme')
  // await Main.openUri(`${tmpDir}/test.xyz`)

  // // assert
  // const token = Locator('.Token')
  // await expect(token).toHaveClass('Xyz')
}
