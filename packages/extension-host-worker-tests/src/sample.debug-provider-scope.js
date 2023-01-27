export const name = 'sample.debug-provider-scope'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Run And Debug')

  // assert
  const debugButtonOne = Locator('.DebugButton').nth(0)
  await expect(debugButtonOne).toHaveAttribute('title', 'Resume')
  const rows = Locator('.DebugRow')
  await expect(rows).toHaveCount(9)
  await expect(rows.nth(0)).toHaveText('Local')
  await expect(rows.nth(1)).toHaveText('this: process')
  await expect(rows.nth(2)).toHaveText('now: 1985388')
  await expect(rows.nth(3)).toHaveText('list: undefined')
  await expect(rows.nth(4)).toHaveText('ranAtLeastOneList: undefined')
  await expect(rows.nth(5)).toHaveText('Closure (getTimerCallbacks)')
  await expect(rows.nth(6)).toHaveText('Closure')
  await expect(rows.nth(7)).toHaveText('Global')
  await expect(rows.nth(8)).toHaveText('processTimers')
}
