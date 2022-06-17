import clipboardEx from 'electron-clipboard-ex'

import VError from 'verror'

export const readFiles = async () => {
  const filePaths = clipboardEx.readFilePaths()
  console.log(filePaths)
  return {
    source: 'electron-clipboard-ex',
    type: 'copy', // TODO can't be sure on this
    files: filePaths,
  }
}

export const writeFiles = async (type, files) => {
  try {
    clipboardEx.writeFilePaths(files)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to copy files to clipboard')
  }
}
