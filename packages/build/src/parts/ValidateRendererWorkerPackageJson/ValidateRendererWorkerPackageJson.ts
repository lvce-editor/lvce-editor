import * as JsonFile from '../JsonFile/JsonFile.ts'

const dependencySections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']

const githubTarballPattern = /^https:\/\/github\.com\/.+\.(?:tar\.gz|tgz)(?:[?#].*)?$/i

export const validatePackageJson = (packageJson) => {
  for (const section of dependencySections) {
    const dependencies = packageJson[section] || {}
    for (const [name, version] of Object.entries(dependencies)) {
      if (typeof version === 'string' && githubTarballPattern.test(version)) {
        throw new Error(`renderer-worker package.json dependency "${name}" must use an npm version instead of a GitHub tarball`)
      }
    }
  }
}

export const validateRendererWorkerPackageJson = async () => {
  const packageJson = await JsonFile.readJson('packages/renderer-worker/package.json')
  validatePackageJson(packageJson)
}
