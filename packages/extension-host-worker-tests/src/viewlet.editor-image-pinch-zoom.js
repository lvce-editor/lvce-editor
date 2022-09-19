test('viewlet.editor-image', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="blue"/></svg>`
  )

  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/file1.svg`)

  // assert
  const viewletImage = Locator('.ViewletImage')
  await expect(viewletImage).toBeVisible()

  // workaround for not being setPointerCapture() not working on
  // synthetic events
  await Eval.evalInRendererProcess(`
globalThis._originalSetPointerCapture = Element.prototype.setPointerCapture
globalThis._originalReleasePointerCapture = Element.prototype.releasePointerCapture

Element.prototype.setPointerCapture = () => {}
Element.prototype.releasePointerCapture = () => {}
`)

  // act
  await viewletImage.dispatchEvent('pointerdown', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 1,
  })
  await viewletImage.dispatchEvent('pointerdown', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 2,
  })
  await viewletImage.dispatchEvent('pointermove', {
    clientX: 10,
    clientY: 10,
    bubbles: true,
    pointerId: 2,
  })
  await viewletImage.dispatchEvent('pointerup', {
    clientX: 10,
    clientY: 10,
    bubbles: true,
    pointerId: 2,
  })
  await viewletImage.dispatchEvent('pointerup', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 1,
  })

  // assert
  const imageWrapper = Locator('.ImageWrapper')
  await expect(imageWrapper).toHaveCSS(
    'transform',
    'matrix(1.07071, 0, 0, 1.07071, -0.353553, 3.53553)'
  )

  // act
  await viewletImage.dispatchEvent('pointerdown', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 1,
  })
  await viewletImage.dispatchEvent('pointerdown', {
    clientX: 10,
    clientY: 10,
    bubbles: true,
    pointerId: 2,
  })
  await viewletImage.dispatchEvent('pointermove', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 2,
  })
  await viewletImage.dispatchEvent('pointerup', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 2,
  })
  await viewletImage.dispatchEvent('pointerup', {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    pointerId: 1,
  })

  // assert
  await expect(imageWrapper).toHaveCSS(
    'transform',
    'matrix(0.995, 0, 0, 0.995, -0.328553, -0.603553)'
  )

  await Eval.evalInRendererProcess(`
Element.prototype.setPointerCapture = globalThis._originalSetPointerCapture
Element.prototype.releasePointerCapture = globalThis._originalReleasePointerCapture
`)
})
