test('viewlet.main-tabs', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/languages`)
  await FileSystem.mkdir(`${tmpDir}/sample-folder`)
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  await FileSystem.writeFile(`${tmpDir}/languages/index.html`, 'div')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/b.txt`, 'b')
  await FileSystem.writeFile(`${tmpDir}/sample-folder/c.txt`, 'c')

  // act
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.txt`)

  // assert
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
  const tab1 = tabs.nth(0)
  await expect(tab1).toHaveText('test.txt')
  await expect(tab1).toHaveAttribute('aria-selected', 'true')
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('div')

  // act
  await Main.openUri(`${tmpDir}/sample-folder/a.txt`)

  // assert
  await expect(tabs).toHaveCount(2)
  await expect(tab1).toHaveAttribute('aria-selected', 'false')
  const tab2 = tabs.nth(1)
  await expect(tab2).toHaveText('a.txt')
  await expect(tab2).toHaveAttribute('aria-selected', 'true')
  await expect(editor).toHaveText('a')

  // act
  await Main.focusPreviousTab()

  // assert
  await expect(tab1).toHaveAttribute('aria-selected', 'true')
  await expect(tab2).toHaveAttribute('aria-selected', 'false')
  await expect(editor).toHaveText('div')

  // act
  await Main.focusPreviousTab()

  // assert
  await expect(editor).toHaveText('a')

  // act
  await Main.openUri(`${tmpDir}/sample-folder/b.txt`)

  // assert
  await expect(tabs).toHaveCount(3)
  await expect(editor).toHaveText('b')

  // act
  await Main.closeOtherTabs()

  // assert
  await expect(tabs).toHaveCount(1)
  await expect(tab1).toHaveText('b.txt')
})
