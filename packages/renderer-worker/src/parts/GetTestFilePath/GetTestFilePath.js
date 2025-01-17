import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getTestFilePath = async (href) => {
  const testPath = await PlatformPaths.getTestPath()
  const fileName = href.slice(href.lastIndexOf('/') + 1)
  const jsfileName = fileName.replace(/\.html$/, '.js')
  const jsPath = `${testPath}/src/${jsfileName}`
  if (Platform.platform === PlatformType.Web) {
    return jsPath
  }
  return jsPath
}
