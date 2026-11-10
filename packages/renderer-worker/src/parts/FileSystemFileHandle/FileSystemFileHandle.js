import * as HtmlFile from '../HtmlFile/HtmlFile.js'

/** @typedef {FileSystemFileHandle | {kind: 'file', name: string, file: File, readonly: true}} FileHandle */

/**
 *
 * @param {FileHandle} handle
 * @returns
 */
export const getFile = (handle) => {
  if ('file' in handle) {
    return handle.file
  }
  return handle.getFile()
}

/**
 *
 * @param {FileHandle} handle
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
  if ('readonly' in handle && handle.readonly) {
    throw new Error(`File ${handle.name} is read-only`)
  }
  // @ts-ignore
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

/**
 *
 * @param {FileHandle} handle
 * @param {Response} response
 */
export const writeResponse = async (handle, response) => {
  if ('readonly' in handle && handle.readonly) {
    throw new Error(`File ${handle.name} is read-only`)
  }
  // @ts-ignore
  const writable = await handle.createWritable()
  // @ts-ignore
  await response.body.pipeTo(writable)
}
