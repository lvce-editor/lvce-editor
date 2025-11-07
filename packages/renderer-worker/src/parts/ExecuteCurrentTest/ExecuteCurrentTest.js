import * as GetTestFilePath from '../GetTestFilePath/GetTestFilePath.js'
import * as Test from '../Test/Test.js'

export const executeCurrentTest = async (platform, initData) => {
  const jsPath = await GetTestFilePath.getTestFilePath(platform, initData.Location.href)
  await Test.execute(jsPath)
}
