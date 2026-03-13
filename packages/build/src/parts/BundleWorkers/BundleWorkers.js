import * as AdjustWorkers from '../AdjustWorkers/AdjustWorkers.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'

const workersJsonPath = 'packages/renderer-worker/src/parts/Workers/Workers.json'

const stripLeadingSlash = (path) => {
  return path.startsWith('/') ? path.slice(1) : path
}

const copyWorkers = async ({ toRoot }) => {
  const workers = await JsonFile.readJson(workersJsonPath)
  for (const worker of workers) {
    if (worker.id === 'rendererWorker') {
      continue
    }
    const { defaultPath, productionPath } = worker
    if (!defaultPath || !productionPath) {
      continue
    }
    await Copy.copyFile({
      from: stripLeadingSlash(defaultPath),
      to: Path.join(toRoot, stripLeadingSlash(productionPath)),
    })
  }
}

export const bundleWorkers = async ({ commitHash, platform, assetDir, version, date, product, toRoot }) => {
  const rendererProcessCachePath = await BundleRendererProcessCached.bundleRendererProcessCached({
    commitHash,
    platform,
    assetDir,
  })
  await Copy.copy({
    from: rendererProcessCachePath,
    to: `${toRoot}/packages/renderer-process`,
    ignore: ['static'],
  })
  const rendererWorkerCachePath = await BundleRendererWorkerCached.bundleRendererWorkerCached({
    commitHash,
    platform,
    assetDir,
    version,
    date,
    product,
  })
  await Copy.copy({
    from: rendererWorkerCachePath,
    to: `${toRoot}/packages/renderer-worker`,
    ignore: ['static'],
  })
  await copyWorkers({ toRoot })

  await AdjustWorkers.adjustWorkers({
    toRoot,
    commitHash,
    date,
    version,
  })

  await Copy.copy({
    from: 'packages/shared-process/node_modules/@lvce-editor/preview-process/files/previewInjectedCode.js',
    to: `${toRoot}/js/preview-injected.js`,
  })

  await Copy.copyFile({
    from: 'packages/shared-process/node_modules/@lvce-editor/preload/src/index.js',
    to: Path.join(`${toRoot}/packages/preload`, 'dist', 'index.js'),
  })
}
