import * as Platform from '../Platform/Platform.js'

export const getUrl = () => {
  const assetDir = Platform.getAssetDir()
  const url = `${assetDir}/packages/pdf-worker/src/pdfWorkerMain.js`
  return url
}
