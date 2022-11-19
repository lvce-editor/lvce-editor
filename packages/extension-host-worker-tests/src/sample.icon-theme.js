test('sample.icon-theme', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await FileSystem.mkdir(`${tmpDir}/test-folder`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL('../fixtures/sample.icon-theme', import.meta.url).toString()
  )

  // act
  await IconTheme.setIconTheme('test-icon-theme')

  // assert
  const iconFile = Locator('.TreeItem[aria-label="test.xyz"] i')
  await expect(iconFile).toHaveClass('Icon_file')
  const baseUrl = BaseUrl.getBaseUrl()
  await expect(iconFile).toHaveCSS(
    'background-image',
    `url("${baseUrl}packages/extension-host-worker-tests/fixtures/sample.icon-theme/icons/default_file.svg")`
  )
})

export {}
