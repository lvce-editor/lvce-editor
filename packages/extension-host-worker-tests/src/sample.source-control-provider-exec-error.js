export const mockExec = (command, args, options) => {
  if (command === 'test-source-control') {
    if (args[0] === 'get-files') {
      return {
        stdout: `file-1.txt
file-2.txt`,
        stderr: ``,
        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

export const name = 'sample.source-control-provider-exec-error'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Source Control')

  // assert
  const sourceControl = Locator('.SourceControl')
  await expect(sourceControl).toHaveText('ExecError: Failed to execute test-source-control: process exited with code 128')
}
