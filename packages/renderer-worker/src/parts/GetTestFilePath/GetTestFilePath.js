import * as GetUrlBaseName from '../GetUrlBaseName/GetUrlBaseName.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

// TODO determine with websocket request or some
// data in html that shows whether this test is
// a typescript or javascript file
const existsTest = async (url) => {
  const tsResponse = await fetch(url, {
    method: 'HEAD',
  })
  if (tsResponse.ok) {
    return true
  }
  return false
}

export const getTestFilePath = async (platform, href) => {
  const testPath = await PlatformPaths.getTestPath()
  const baseName = GetUrlBaseName.getUrlBaseName(href)
  const jsFileName = baseName + '.js'
  const tsFileName = baseName + '.ts'
  const jsPath = `${testPath}/src/${jsFileName}`
  const tsPath = `${testPath}/src/${tsFileName}`
  if (platform === PlatformType.Web) {
    return jsPath
  }
  const existsTsPath = await existsTest(tsPath)
  if (existsTsPath) {
    return tsPath
  }
  return jsPath
}
