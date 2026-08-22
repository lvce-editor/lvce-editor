export const name = 'viewlet.editor-color-picker-outline'

export const test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'abc')
  await Main.openUri(`${tmpDir}/file.txt`)

  // act
  await Editor.openColorPicker()

  // assert
  const colorPicker = Locator('.ColorPicker')
  await expect(colorPicker).toBeVisible()
  await expect(colorPicker).toHaveCSS('outline-style', 'none')
}
