export const name = 'viewlet.editor-typescript-destructured-async-default-parameters'

export const test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/status-bar-items.ts`
  const source = `import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getEditorStatusBarItems } from '../GetEditorStatusBarItems/GetEditorStatusBarItems.ts'
import { getNotificationsStatusBarItem } from '../GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import { getProblemsStatusBarItem } from '../GetProblemsStatusBarItem/GetProblemsStatusBarItem.ts'

interface GetBuiltinStatusBarItemsOptions {
  readonly editorStatus?: EditorStatus
  readonly notificationCount?: number
  readonly notificationsEnabled?: boolean
  readonly problemsEnabled?: boolean
}

export const getBuiltinStatusBarItems = async (
  errorCount: number,
  warningCount: number,
  { editorStatus, notificationCount = 0, notificationsEnabled = true, problemsEnabled = true }: GetBuiltinStatusBarItemsOptions = {},
): Promise<readonly StatusBarItem[]> => {
  return [
    ...getEditorStatusBarItems(editorStatus),
    ...getNotificationsStatusBarItem(notificationsEnabled, notificationCount),
    ...getProblemsStatusBarItem(errorCount, warningCount, problemsEnabled),
  ]
}
const nextValue = 123
`
  await FileSystem.writeFile(filePath, source)
  await Settings.update({ 'editor.combineWhitespaceTokens': false })
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await expect(Locator('.Token.Text')).toHaveCount(0)
  await expect(Locator('.Token.Type', { hasText: 'EditorStatus' })).toHaveText('EditorStatus')
  await expect(Locator('.Token.Type', { hasText: 'StatusBarItem' })).toHaveText('StatusBarItem')
  await expect(Locator('.Token.Type', { hasText: 'GetBuiltinStatusBarItemsOptions' })).toHaveCount(2)
  await expect(Locator('.Token.Class', { hasText: 'Promise' })).toHaveText('Promise')
  await expect(Locator('.Token.KeywordReturn')).toHaveCount(1)
  await expect(Locator('.Token.Function', { hasText: 'getEditorStatusBarItems' })).toHaveText('getEditorStatusBarItems')
  await expect(Locator('.Token.Numeric', { hasText: '123' })).toHaveText('123')

  const parameterLine = source.split('\n').findIndex((line) => line.includes('notificationCount = 0'))
  const parameterColumn = source.split('\n')[parameterLine].indexOf('notificationCount = 0') + 'notificationCount = '.length
  await Editor.setCursor(parameterLine, parameterColumn)
  await Editor.type('1')

  await expect(Locator('.Token.Text')).toHaveCount(0)
  await expect(Locator('.Token.Numeric', { hasText: '10' })).toHaveText('10')
  await expect(Locator('.Token.KeywordReturn')).toHaveCount(1)
  await expect(Locator('.Token.Numeric', { hasText: '123' })).toHaveText('123')
}
