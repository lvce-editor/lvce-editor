import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetUrlBaseName from '../GetUrlBaseName/GetUrlBaseName.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const existsTest = async (url) => {
  const uri = url.replace('/remote', 'file://')
  const exists = await FileSystem.exists(uri)
  return exists
}

export const getTestFilePath = async (href) => {
  const testPath = await PlatformPaths.getTestPath()
  const baseName = GetUrlBaseName.getUrlBaseName(href)
  const jsFileName = baseName + '.js'
  const tsFileName = baseName + '.ts'
  const jsPath = `${testPath}/src/${jsFileName}`
  const tsPath = `${testPath}/src/${tsFileName}`
  if (Platform.platform === PlatformType.Web) {
    return jsPath
  }
  const existsTsPath = await existsTest(tsPath)
  if (existsTsPath) {
    return tsPath
  }
  return jsPath
}
