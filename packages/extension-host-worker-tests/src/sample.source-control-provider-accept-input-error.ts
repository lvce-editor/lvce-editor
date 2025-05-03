export const name = 'sample.source-control-provider-accept-input-error'

// TODO add test for when source control provider returns invalid changed files
// e.g. string[] instead of {file:string}[]
// currently it throws an error `cannot read properties of undefined, reading toLowerCase` in IconTheme.js

export const skip = true

export const test = async ({ FileSystem, Workspace, Extension, SideBar, SourceControl }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await SideBar.open('Source Control')
  await SourceControl.handleInput('abc')

  // act
  // await SourceControl.acceptInput()

  // assert

  // TODO error dialog should be shown
  // TODO error and codeframe should be printed to console
}
