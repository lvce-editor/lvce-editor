import * as FileSystem from '../FileSystem/FileSystem.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Path from '../Path/Path.js'

export const loadReadmeContent = async (path) => {
  try {
    const readmeUrl = Path.join('/', path, 'README.md')
    const readmeContent = await FileSystem.readFile(readmeUrl)
    return readmeContent
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      return ''
    }
    console.error(error)
    return `${error}`
  }
}
