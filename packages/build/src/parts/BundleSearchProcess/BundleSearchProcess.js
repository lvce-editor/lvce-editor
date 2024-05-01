import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const createNewPackageJson = (oldPackageJson, target) => {
  const newPackageJson = {
    ...oldPackageJson,
  }
  delete newPackageJson.scripts
  delete newPackageJson.description
  delete newPackageJson.devDependencies
  delete newPackageJson.xo
  delete newPackageJson.jest
  delete newPackageJson.directories
  delete newPackageJson.dependencies
  newPackageJson.main = 'dist/searchProcessMain.js'
  return newPackageJson
}

export const bundleSearchProcess = async ({ cachePath, target }) => {
  await Copy.copy({
    from: 'packages/search-process/src',
    to: `${cachePath}/src`,
  })
  await Copy.copy({
    from: 'packages/search-process/package.json',
    to: `${cachePath}/package.json`,
  })
  if (target === 'server') {
    await WriteFile.writeFile({
      to: `${cachePath}/index.js`,
      content: `import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const searchProcessPath = join(__dirname, 'dist', 'searchProcessMain.js')
`,
    })
    await Copy.copyFile({
      from: 'LICENSE',
      to: `${cachePath}/LICENSE`,
    })
  }

  const oldPackageJson = await JsonFile.readJson(`${cachePath}/package.json`)
  const newPackageJson = createNewPackageJson(oldPackageJson, target)
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: newPackageJson,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/searchProcessMain.js`,
    platform: 'node',
    allowCyclicDependencies: false,
  })
}
