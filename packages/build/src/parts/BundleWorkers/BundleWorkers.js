import * as BundleDiffWorkerCached from '../BundleDiffWorkerCached/BundleDiffWorkerCached.js'
import * as BundleEditorWorkerCached from '../BundleEditorWorkerCached/BundleEditorWorkerCached.js'
import * as BundleExtensionHostWorkerCached from '../BundleExtensionHostWorkerCached/BundleExtensionHostWorkerCached.js'
import * as BundleFileSearchWorkerCached from '../BundleFileSearchWorkerCached/BundleFileSearchWorkerCached.js'
import * as BundleIframeWorkerCached from '../BundleIframeWorkerCached/BundleIframeWorkerCached.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as BundleSyntaxHighlightingWorkerCached from '../BundleSyntaxHighlightingWorkerCached/BundleSyntaxHighlightingWorkerCached.js'
import * as BundleTerminalWorkerCached from '../BundleTerminalWorkerCached/BundleTerminalWorkerCached.js'
import * as BundleEmbedsWorkerCached from '../BundleEmbedsWorkerCached/BundleEmbedsWorkerCached.js'
import * as BundleTestWorkerCached from '../BundleTestWorkerCached/BundleTestWorkerCached.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

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
  const extensionHostWorkerCachePath = await BundleExtensionHostWorkerCached.bundleExtensionHostWorkerCached({
    commitHash,
    platform,
    assetDir,
  })
  await Copy.copy({
    from: extensionHostWorkerCachePath,
    to: `${toRoot}/packages/extension-host-worker`,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`${toRoot}/packages/extension-host-sub-worker`),
    from: 'src/extensionHostSubWorkerMain.js',
    platform: 'webworker',
    codeSplitting: false,
  })
  const terminalWorkerCachePath = await BundleTerminalWorkerCached.bundleTerminalWorkerCached({
    assetDir,
    platform,
    commitHash,
  })
  await Copy.copy({
    from: terminalWorkerCachePath,
    to: `${toRoot}/packages/terminal-worker`,
  })
  const editorWorkerCachePath = await BundleEditorWorkerCached.bundleEditorWorkerCached({
    assetDir,
    platform,
    commitHash,
  })
  await Copy.copy({
    from: editorWorkerCachePath,
    to: `${toRoot}/packages/editor-worker`,
  })
  const testWorkerCachePath = await BundleTestWorkerCached.bundleTestWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: testWorkerCachePath,
    to: `${toRoot}/packages/test-worker`,
  })
  const diffWorkerCachePath = await BundleDiffWorkerCached.bundleDiffWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: diffWorkerCachePath,
    to: `${toRoot}/packages/diff-worker`,
  })
  const syntaxHighlightingWorkerCachePath = await BundleSyntaxHighlightingWorkerCached.bundleSyntaxHighlightingWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: syntaxHighlightingWorkerCachePath,
    to: `${toRoot}/packages/syntax-highlighting-worker`,
  })
  const iframeWorkerCachePath = await BundleIframeWorkerCached.bundleIframeWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: iframeWorkerCachePath,
    to: `${toRoot}/packages/iframe-worker`,
  })
  const fileSearchWorkerCachePath = await BundleFileSearchWorkerCached.bundleFileSearchWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: fileSearchWorkerCachePath,
    to: `${toRoot}/packages/file-search-worker`,
  })

  const embedsWorkerCachePath = await BundleEmbedsWorkerCached.bundleEmbedsWorkerCached({
    commitHash,
    platform: 'electron',
    assetDir: `../../../../..`,
  })

  console.time('copyEmbedsWorkerFiles')
  await Copy.copy({
    from: embedsWorkerCachePath,
    to: `${toRoot}/packages/embeds-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyEmbedsWorkerFiles')
}
