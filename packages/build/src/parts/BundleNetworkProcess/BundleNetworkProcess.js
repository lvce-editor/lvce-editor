import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'

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

export const bundleNetworkProcess = async ({ cachePath, target }) => {
  await Copy.copy({
    from: 'packages/network-process/src',
    to: `${cachePath}/src`,
  })
  await Copy.copy({
    from: 'packages/network-process/package.json',
    to: `${cachePath}/package.json`,
  })
  if (target === 'server') {
    await Copy.copy({
      from: 'packages/network-process/bin',
      to: `${cachePath}/bin`,
    })
    await Copy.copy({
      from: 'packages/network-process/index.js',
      to: `${cachePath}/index.js`,
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
}
