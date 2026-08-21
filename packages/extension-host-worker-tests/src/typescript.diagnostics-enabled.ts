import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'typescript.diagnostics-enabled'

const waitFor = async (assertion: () => Promise<void>): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await assertion()
      return
    } catch (error) {
      if (attempt === 99) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.ts`
  await FileSystem.writeFile(uri, 'const foo: string = 123\n\nconsole.log(foo)\n')
  await Settings.update({ 'editor.diagnostics': true })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  const editor = Locator('.EditorContainer > .Viewlet.Editor')
  await expect(editor).toHaveCount(1)

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
  const scrollBarDiagnostics = editor.locator('.ScrollBarDiagnostic')
  const errorScrollBarDiagnostics = editor.locator('.ScrollBarDiagnosticError')
  await waitFor(() => expect(scrollBarDiagnostics).toHaveCount(expectedDiagnostics.length))
  await expect(errorScrollBarDiagnostics).toHaveCount(expectedDiagnostics.length)
}
