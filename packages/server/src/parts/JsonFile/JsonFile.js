import { readFile } from 'fs/promises'

export const readJson = async (path) => {
  const content = await readFile(path, 'utf-8')
  const json = JSON.parse(content)
  return json
}
