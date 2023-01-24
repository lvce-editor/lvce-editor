import * as Platform from '../Platform/Platform.js'

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
    if (error instanceof TypeError && error.message === 'item.getAsFileSystemHandle is not a function' && Platform.getBrowser() === 'firefox') {
      throw new Error(`The File System Access Api is not supported on Firefox`)
    }
    throw error
  }
}
