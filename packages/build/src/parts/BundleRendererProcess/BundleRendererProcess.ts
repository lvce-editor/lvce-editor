import { VError } from '@lvce-editor/verror'
import { readFile, writeFile } from 'node:fs/promises'
import * as Copy from '../Copy/Copy.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Replace from '../Replace/Replace.ts'

const workersJsonPath = 'packages/renderer-worker/src/parts/Workers/Workers.json'
const electronPlatformCode = '2'

const replaceDeclaration = async ({ path, name, value }) => {
  const content = await readFile(path, 'utf8')
  const occurrence = new RegExp(`const ${name} = [^;]+;`)
  if (!occurrence.test(content)) {
    throw new Error(`Failed to replace declaration const ${name}`)
  }
  const newContent = content.replace(occurrence, `const ${name} = ${value};`)
  if (newContent !== content) {
    await writeFile(path, newContent)
  }
}

const getWorkerPathReplacements = async () => {
  const workers = await JsonFile.readJson(workersJsonPath)
  return workers
    .filter((worker) => {
      return worker.defaultPath && worker.productionPath && worker.defaultPath !== worker.productionPath
    })
    .map((worker) => {
      return {
        occurrence: worker.defaultPath,
        replacement: worker.productionPath,
      }
    })
}

const replaceWorkerPaths = async (path) => {
  const replacements = await getWorkerPathReplacements()
  const content = await readFile(path, 'utf8')
  let newContent = content
  for (const { occurrence, replacement } of replacements) {
    if (newContent.includes(occurrence)) {
      newContent = newContent.split(occurrence).join(replacement)
    }
  }
  if (newContent !== content) {
    await writeFile(path, newContent)
  }
}

const getPlatformCode = (platform) => {
  switch (platform) {
    case 'electron':
      return electronPlatformCode
    case 'remote':
      return `Remote`
    case 'web':
      return 'Web'
    default:
      throw new Error(`unsupported platform ${platform}`)
  }
}

export const bundleRendererProcess = async ({ cachePath, commitHash, platform, assetDir }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process',
      to: `${cachePath}`,
      dereference: true,
    })
    // TODO renderer process should make it easier to adjust paths
    const rendererProcessPath = `${cachePath}/dist/rendererProcessMain.js`
    const rendererProcessContent = await readFile(rendererProcessPath, 'utf8')
    if (rendererProcessContent.includes('/packages/renderer-worker/src/rendererWorkerMain.ts')) {
      await Replace.replace({
        path: rendererProcessPath,
        occurrence: '/packages/renderer-worker/src/rendererWorkerMain.ts',
        replacement: `/packages/renderer-worker/dist/rendererWorkerMain.js`,
      })
    }
    await replaceDeclaration({
      path: rendererProcessPath,
      name: 'assetDir',
      value: `'${assetDir}'`,
    })
    await replaceWorkerPaths(`${cachePath}/dist/rendererProcessMain.js`)
    const platformCode = getPlatformCode(platform)
    await replaceDeclaration({
      path: rendererProcessPath,
      name: 'platform',
      value: platformCode,
    })
    if (platform === 'electron') {
      // await Replace.replace({
      //   path: `${cachePath}/dist/rendererProcessMain.js`,
      //   occurrence: `const isFirefox = getIsFirefox()`,
      //   replacement: `const isFirefox = false`,
      // })
    }
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer process`)
  }
}
