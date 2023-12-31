import * as JsonFile from '../JsonFile/JsonFile.js'

export const addRootPackageJson = async ({ cachePath, electronVersion, product, bundleMainProcess, version }) => {
  const main = bundleMainProcess ? 'packages/main-process/dist/mainProcessMain.js' : 'packages/main-process/src/mainProcessMain.js'
  const type = 'module'
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: {
      name: product.applicationName,
      productName: product.nameLong,
      version: version,
      electronVersion,
      type,
      main,
    },
  })
}
