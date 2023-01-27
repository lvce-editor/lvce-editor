export const name = 'sample.file-system-provider-error-missing-id'

export const test = async ({ Extension, Main }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  const tmpDir = `extension-host://xyz://folder`

  // act
  await Main.openUri(`${tmpDir}/file-1.txt`)

  // TODO verify that error message is displayed in editor
}
