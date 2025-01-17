import * as Command from '../Command/Command.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const executeCurrentTest = async (initData) => {
  const testPath = await PlatformPaths.getTestPath()
  const href = initData.Location.href
  const fileName = href.slice(href.lastIndexOf('/') + 1)
  const jsfileName = fileName.replace(/\.html$/, '.js')
  const jsPath = `${testPath}/src/${jsfileName}`
  await Command.execute('Test.execute', jsPath)
}
