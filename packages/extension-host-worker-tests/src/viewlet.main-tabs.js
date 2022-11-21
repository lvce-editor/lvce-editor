test('viewlet.main-tabs', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/languages`)
  await FileSystem.mkdir(`${tmpDir}/sample-folder`)
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  await FileSystem.writeFile(`${tmpDir}/languages/index.html`, 'div')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/c.txt`, '')

  // act
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.txt`)
})
