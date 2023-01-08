const name = 'sample.debug-provider-scope'

test('sample.debug-provider-scope', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await SideBar.open('Run And Debug')

  // assert
  const debugButtonOne = Locator('.DebugButton').nth(0)
  await expect(debugButtonOne).toHaveAttribute('title', 'continue')
  const rows = Locator('.DebugSectionRow')
  await expect(rows).toHaveCount(8)
  await expect(rows.nth(0)).toHaveText('Local')
  await expect(rows.nth(1)).toHaveText('this: process')
  await expect(rows.nth(2)).toHaveText('now: 1985388')
  await expect(rows.nth(3)).toHaveText('list: undefined')
  await expect(rows.nth(4)).toHaveText('ranAtLeastOneList: undefined')
  await expect(rows.nth(5)).toHaveText('Closure (getTimerCallbacks)')
  await expect(rows.nth(6)).toHaveText('Closure')
  await expect(rows.nth(7)).toHaveText('Global')
})

export {}
