import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'

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
  newPackageJson.main = 'dist/embedsProcessMain.js'
  return newPackageJson
}

export const bundleEmbedsProcess = async ({ cachePath, target }) => {
  await Copy.copy({
    from: 'packages/embeds-process/src',
    to: `${cachePath}/src`,
  })
  await Copy.copy({
    from: 'packages/embeds-process/package.json',
    to: `${cachePath}/package.json`,
  })
  const oldPackageJson = await JsonFile.readJson(`${cachePath}/package.json`)
  const newPackageJson = createNewPackageJson(oldPackageJson, target)
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: newPackageJson,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/embedsProcessMain.js`,
    platform: 'node',
    allowCyclicDependencies: false,
  })
}
