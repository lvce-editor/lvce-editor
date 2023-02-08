import * as IsFileSystemAccessNotSupportedOnFireFoxError from '../IsFileSystemAccessNotSupportedOnFireFoxError/IsFileSystemAccessNotSupportedOnFirefoxError.js'

const getHandle = async (item) => {
  const entry = await item.getAsFileSystemHandle()
  return entry
}

export const getFileHandles = async (items) => {
  try {
    const itemsArray = [...items]
    const handles = await Promise.all(itemsArray.map(getHandle))
    return handles
  } catch (error) {
    if (IsFileSystemAccessNotSupportedOnFireFoxError.isFileSystemAccessNotSupportedOnFireFoxError(error)) {
      throw new Error(`The File System Access Api is not supported on Firefox`)
    }
    throw error
  }
}
