import { VError } from '@lvce-editor/verror'
import { readFile, writeFile } from 'node:fs/promises'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Replace from '../Replace/Replace.js'

const workersJsonPath = 'packages/renderer-worker/src/parts/Workers/Workers.json'

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
      return `Electron`
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
    })
    // TODO renderer process should make it easier to adjust paths
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: '/packages/renderer-worker/src/rendererWorkerMain.ts',
      replacement: `/packages/renderer-worker/dist/rendererWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: `const assetDir = getAssetDir();`,
      replacement: `const assetDir = '${assetDir}';`,
    })
    await replaceWorkerPaths(`${cachePath}/dist/rendererProcessMain.js`)
    const platformCode = getPlatformCode(platform)
    await Replace.replace({
      path: `${cachePath}/dist/rendererProcessMain.js`,
      occurrence: 'const platform = getPlatform();',
      replacement: `const platform = ${platformCode};`,
    })
    if (platform === 'electron') {
      await Replace.replace({
        path: `${cachePath}/dist/rendererProcessMain.js`,
        occurrence: `const isFirefox = getIsFirefox()`,
        replacement: `const isFirefox = false`,
      })
    }
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer process`)
  }
}
