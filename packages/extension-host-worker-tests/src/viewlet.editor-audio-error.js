// TODO avoid flickering when loading audio fails

test('viewlet.editor-audio-error', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.mp3`, `abc`)

  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/file1.mp3`)

  // assert
  const viewletAudio = Locator('.ViewletAudio')
  await expect(viewletAudio).toBeVisible()
  const error = Locator('.ViewletError')
  await expect(error).toBeVisible()

  // TODO
  // await expect(viewletAudio).toHaveText('Failed to load audio')
})
