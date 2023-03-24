import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Path from '../Path/Path.js'

export const loadReadmeContent = async (path) => {
  try {
    const readmeUrl = Path.join('/', path, 'README.md')
    const readmeContent = await FileSystem.readFile(readmeUrl)
    return readmeContent
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      return ''
    }
    console.error(error)
    return `${error}`
  }
}
