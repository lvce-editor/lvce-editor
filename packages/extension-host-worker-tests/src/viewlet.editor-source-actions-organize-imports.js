export const name = 'viewlet.editor-source-actions-organize-imports'

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, Extension }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file.xyz`,
    `import { b } from './b.ts'
import { a } from './a.ts'
`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.xyz`)

  // act
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openSourceActions()
  await Editor.sourceActionsSelectCurrent()

  // assert
  const editorRows = Locator('.EditorRow')
  const firstRow = editorRows.nth(0)
  await expect(firstRow).toHaveText(`import { a } from './a.ts'`)
  const secondRow = editorRows.nth(0)
  await expect(secondRow).toHaveText(`import { b } from './b.ts'`)
}
