import * as HtmlFile from '../HtmlFile/HtmlFile.js'

export const getFile = (handle) => {
  return handle.getFile()
}

export const getBinaryString = async (handle) => {
  const file = await getFile(handle)
  const text = await HtmlFile.getBinaryString(file)
  return text
}

export const write = async (handle, content) => {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

export const writeResponse = async (handle, response) => {
  const writable = await handle.createWritable()
  await response.body.pipeTo(writable)
}
