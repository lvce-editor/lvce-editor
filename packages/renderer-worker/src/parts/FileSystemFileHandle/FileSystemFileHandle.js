import * as HtmlFile from '../HtmlFile/HtmlFile.js'

/**
 *
 * @param {FileSystemFileHandle} handle
 * @returns
 */
export const getFile = (handle) => {
  return handle.getFile()
}

/**
 *
 * @param {FileSystemFileHandle} handle
 * @returns
 */
export const getBinaryString = async (handle) => {
  const file = await getFile(handle)
  const text = await HtmlFile.getBinaryString(file)
  return text
}

/**
 *
 * @param {FileSystemFileHandle} handle
 * @param {string} content
 */
export const write = async (handle, content) => {
  // @ts-ignore
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

/**
 *
 * @param {FileSystemFileHandle} handle
 * @param {Response} response
 */
export const writeResponse = async (handle, response) => {
  // @ts-ignore
  const writable = await handle.createWritable()
  // @ts-ignore
  await response.body.pipeTo(writable)
}
