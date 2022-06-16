import { execa } from 'execa'
import * as fs from 'fs/promises'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const root = `${__dirname}/../../../..`

export const tmpDir = tmpdir()

export const writeFile = async (path, content) => {
  await fs.mkdir(dirname(path), { recursive: true })
  await fs.writeFile(path, content)
}

const originalConsoleTime = console.time.bind(console)
const originalConsoleTimeEnd = console.timeEnd.bind(console)

console.time = (name) => {
  process.stdout.write(`${name} ...`)
  originalConsoleTime(name)
}
console.timeEnd = (name) => {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  originalConsoleTimeEnd(name)
}

export const rename = async (oldPath, newPath) => {
  await fs.rename(oldPath, newPath)
}

export const copyFolder = async (oldPath, newPath) => {
  await fs.mkdir(newPath, { recursive: true })
  await execa('cp', ['-a', `${oldPath}/.`, newPath])
}

export const copyFile = async (oldPath, newPath) => {
  await fs.mkdir(dirname(newPath), { recursive: true })
  await fs.copyFile(oldPath, newPath)
}

export const remove = async (path) => {
  await fs.rm(path, { recursive: true, force: true })
}
// export const mkdir = ()
// import { copyFile, mkdir, rename } from 'fs/promises'

export const getTmpDir = () => {
  return join(root, 'build', '.tmp')
}
