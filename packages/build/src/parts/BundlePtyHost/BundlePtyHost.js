import { readFile, readdir, rename, writeFile } from 'fs/promises'
import { join } from 'path'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as ReplaceTs from '../ReplaceTs/ReplaceTs.js'

const createNewPackageJson = (oldPackageJson, target) => {
  const newPackageJson = {
    ...oldPackageJson,
  }
  delete newPackageJson.scripts
  delete newPackageJson.description
  delete newPackageJson.devDependencies
  delete newPackageJson.xo
  delete newPackageJson.jest
  if (target !== 'server') {
    delete newPackageJson.keywords
    delete newPackageJson.author
    delete newPackageJson.license
    delete newPackageJson.repository
    delete newPackageJson.engines
  }
  return newPackageJson
}

export const bundlePtyHost = async ({ cachePath, target }) => {
  await Copy.copy({
    from: 'packages/pty-host/src',
    to: `${cachePath}/src`,
  })
  await Copy.copy({
    from: 'packages/pty-host/package.json',
    to: `${cachePath}/package.json`,
  })
  const oldPackageJson = await JsonFile.readJson(`${cachePath}/package.json`)
  const newPackageJson = createNewPackageJson(oldPackageJson, target)
  const dirents = await readdir(`${cachePath}/src`, { recursive: true, withFileTypes: true })
  for (const dirent of dirents) {
    const direntName = join(dirent.path, dirent.name)
    if (dirent.isDirectory()) {
      continue
    }
    const content = await readFile(direntName, 'utf8')
    const newContent = await ReplaceTs.replaceTs(content)
    if (content !== newContent) {
      await writeFile(direntName, newContent)
    }
    if (direntName.endsWith('.ts')) {
      await rename(direntName, `${direntName.slice(0, -3)}.js`)
    }
  }
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: newPackageJson,
  })
}
