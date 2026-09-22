import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.problems-diagnostic-counts'

const waitFor = async (assertion: () => Promise<void>): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await assertion()
      return
    } catch (error) {
      if (attempt === 99) throw error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.ts`
  await FileSystem.writeFile(uri, 'const foo: string = 123\n\nconsole.log(foo)\n')
  await Settings.update({ 'editor.diagnostics': true })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const expectedDiagnostics = [
    {
      code: 2322,
      columnIndex: 6,
      endColumnIndex: 9,
      endRowIndex: 0,
      message: "Type 'number' is not assignable to type 'string'.",
      rowIndex: 0,
      source: 'ts',
      type: 'error',
      uri,
    },
  ] as const
  await waitFor(() => Editor.shouldHaveDiagnostics(expectedDiagnostics))

  const itemProblems = Locator('.StatusBarItem[name="Problems"]')
  const problemCounts = itemProblems.locator('.StatusBarItemLabel')
  const errorCount = problemCounts.first()
  const warningCount = problemCounts.nth(1)
  await expect(itemProblems).toBeVisible()
  await expect(problemCounts).toHaveCount(2)
  await expect(errorCount).toHaveText('1')
  await expect(warningCount).toHaveText('0')

  await Command.execute('StatusBar.handleExtensionsChanged')
  await expect(itemProblems).toBeVisible()
  await expect(errorCount).toHaveText('1')
  await expect(warningCount).toHaveText('0')

  await Main.closeAllEditors()
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('0')
}
