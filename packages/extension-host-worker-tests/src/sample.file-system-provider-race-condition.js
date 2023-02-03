export const name = 'sample.file-system-provider-race-condition'

export const test = async ({ Extension, FileSystem, Workspace, Main }) => {
  // arrange
  await Extension.addWebExtension(new URL('../fixtures/sample.file-system-provider-race-condition', import.meta.url).toString())
  const tmpDir = `extension-host://xyz://folder`
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file-3.txt`, 'content 3')

  // act
  await Workspace.setPath(tmpDir)
  await Promise.all([Main.openUri(`${tmpDir}/file-1.txt`), Main.openUri(`${tmpDir}/file-2.txt`), Main.openUri(`${tmpDir}/file-3.txt`)])

  // file 3 loads first and should be focused

  // file 2 loads second

  // file 1 loads last
}
