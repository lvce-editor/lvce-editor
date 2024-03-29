export const name = 'sample.formatting-provider-formatting-error'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.xyz`)

  // act
  await Editor.format()

  // TODO test that error and stack is displayed in the console
  // or in an outoutchannel
  // TODO maybe create a formatting outputchannel
}
