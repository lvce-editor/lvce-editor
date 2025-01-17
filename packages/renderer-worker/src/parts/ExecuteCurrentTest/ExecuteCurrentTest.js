import * as Command from '../Command/Command.js'
import * as GetTestFilePath from '../GetTestFilePath/GetTestFilePath.js'

export const executeCurrentTest = async (initData) => {
  const jsPath = await GetTestFilePath.getTestFilePath(initData.Location.href)
  await Command.execute('Test.execute', jsPath)
}
