export const name = 'viewlet.editor-typescript-memory-statistics'

export const test = async ({ FileSystem, Workspace, Main, Locator, Settings, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/memory-statistics.ts`
  await FileSystem.writeFile(
    filePath,
    `const getMemoryTypeName = (type: string): string => {
  return MemoryTypeNames[type] || (type ? \`${'${'}type[0].toUpperCase()}${'${'}type.slice(1)}\` : 'Other')
}

export const getStatisticsInternal = (
  nodes: Uint32Array,
  nodeFields: readonly string[],
  nodeTypes: readonly string[],
): Statistics => {
  return nodeTypes.length
}
const nextValue = 123
`,
  )
  await Settings.update({ 'editor.combineWhitespaceTokens': false })
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await expect(Locator('.Token.Keyword', { hasText: 'type' })).toHaveCount(0)
  await expect(Locator('.Token.VariableName', { hasText: 'type' })).toHaveCount(5)
  await expect(Locator('.Token.KeywordModifier', { hasText: 'readonly' })).toHaveCount(2)
  await expect(Locator('.Token.TypePrimitive', { hasText: 'string' })).toHaveCount(4)
  await expect(Locator('.Token.Type', { hasText: 'Statistics' })).toHaveText('Statistics')
  await expect(Locator('.Token.String', { hasText: 'Other' })).toHaveText('Other')
  await expect(Locator('.Token.Numeric', { hasText: '123' })).toHaveText('123')
}
