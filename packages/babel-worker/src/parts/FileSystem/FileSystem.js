import * as fs from 'node:fs/promises'

export const writeFile = async (path, content) => {
  await fs.writeFile(path, content)
}

export const readFile = async (path) => {
  await fs.readFile(path, 'utf8')
}
