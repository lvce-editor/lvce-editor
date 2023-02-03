export const name = 'sample.debug-provider-paused-on-exception'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Run And Debug')

  // assert
  // const debugPausedMessage = Locator('.DebugPausedMessage')
  // await expect(debugPausedMessage).toHaveText('Paused on exception')
  const debugButtonOne = Locator('.DebugButton').nth(0)
  await expect(debugButtonOne).toHaveAttribute('title', 'Resume')
  const rows = Locator('.DebugRow')
  await expect(rows).toHaveCount(7)
  await expect(rows.nth(0)).toHaveText('Local')
  await expect(rows.nth(1)).toHaveText(
    'Exception: Error: oops     at Timeout._onTimeout (/test/index.js:5:11)     at listOnTimeout (node:internal/timers:564:17)     at process.processTimers (node:internal/timers:507:7)'
  )
  await expect(rows.nth(2)).toHaveText('this: undefined')
  await expect(rows.nth(3)).toHaveText('Global')
  await expect(rows.nth(4)).toHaveText('(anonymous)')
  await expect(rows.nth(5)).toHaveText('listOnTimeout')
  await expect(rows.nth(6)).toHaveText('processTimers')
}
