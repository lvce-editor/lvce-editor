export const name = 'viewlet.editor-image'

export const skip = true

export const test = async ({ FileSystem, Workspace, Main, Locator, Command, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="blue"/></svg>`,
  )

  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/file1.svg`)

  // assert
  const viewletImage = Locator('.Viewlet.EditorImage')
  await expect(viewletImage).toBeVisible()

  // act
  await viewletImage.dispatchEvent('wheel', {
    clientX: 0,
    clientY: 0,
    deltaX: 0,
    deltaY: -26,
    bubbles: true,
  })

  // assert
  const imageWrapper = Locator('.ImageContent')
  await expect(imageWrapper).toHaveCSS('transform', 'matrix(1.13, 0, 0, 1.13, 0, 7.15)')

  // workaround for not being setPointerCapture() not working on
  // synthetic events
  await Command.execute('PointerCapture.mock')

  // act
  await viewletImage.dispatchEvent('pointerdown', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
  })
  await viewletImage.dispatchEvent('pointermove', {
    clientX: 1,
    clientY: 0,
    bubbles: true,
  })
  await viewletImage.dispatchEvent('pointerup', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
  })

  // assert
  await expect(imageWrapper).toHaveCSS('transform', 'matrix(1.13, 0, 0, 1.13, 1, 7.15)')

  // act
  await Command.execute('PointerCapture.unmock')
}
