import * as OpenFolderModule from '../OpenFolderModule/OpenFolderModule.js'

export const openFolder = async () => {
  const module = await OpenFolderModule.load()
  await module.openFolder()
}
