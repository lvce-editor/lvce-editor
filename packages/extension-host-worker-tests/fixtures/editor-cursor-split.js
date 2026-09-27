export const setup = async ({ Command, FileSystem, Main, Workspace }, direction) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/cursor.txt`
  await FileSystem.writeFile(uri, Array.from({ length: 100 }, (_, index) => `${String(index).padStart(3, '0')}:0123456789`).join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  if (direction) {
    await Command.execute(`Main.split${direction}`)
    await Main.openUri({ uri, reuseExisting: false })
  }
}
