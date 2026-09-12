export const name = 'viewlet.editor-typescript-readonly-union-parameters'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/processes.ts`
  await FileSystem.writeFile(
    filePath,
    `const getChildren = (
  collapsedPids: readonly (number | string)[],
  process: ProcessInfo,
): readonly VisibleProcess[] => {
  if (collapsedPids.length === 0) {
    return []
  }
  if (collapsedPids.includes(process.pid)) {
    return []
  }
  return process.children
}
const nextValue = 123
`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await expect(Locator('.Token.TypePrimitive', { hasText: 'number' })).toHaveText('number')
  await expect(Locator('.Token.Type', { hasText: 'ProcessInfo' })).toHaveText('ProcessInfo')
  await expect(Locator('.Token.Type', { hasText: 'VisibleProcess' })).toHaveText('VisibleProcess')
  await expect(Locator('.Token.KeywordReturn')).toHaveCount(3)
  await expect(Locator('.Token.Numeric', { hasText: '123' })).toHaveText('123')
}
