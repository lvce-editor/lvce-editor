import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'typescript.diagnostics-enabled'

export const test: Test = async ({ Editor, FileSystem, Main, Settings, Workspace }) => {
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
  await Editor.shouldHaveDiagnostics(expectedDiagnostics)
}
