test('sample.icon-theme', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await FileSystem.mkdir(`${tmpDir}/test-folder`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(
      '../fixtures/sample.icon-theme-error-no-icon-definitions',
      import.meta.url
    ).toString()
  )

  // act
  await IconTheme.setIconTheme('test-icon-theme')

  // assert
  // TODO check that warning message is printed to console
})

export {}
