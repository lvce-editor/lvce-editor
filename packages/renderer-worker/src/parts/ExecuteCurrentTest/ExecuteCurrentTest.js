import * as GetTestFilePath from '../GetTestFilePath/GetTestFilePath.js'
import * as Test from '../Test/Test.js'

export const executeCurrentTest = async (initData) => {
  const jsPath = await GetTestFilePath.getTestFilePath(initData.Location.href)
  await Test.execute(jsPath)
}
