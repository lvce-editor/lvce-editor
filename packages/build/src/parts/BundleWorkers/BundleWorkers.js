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
import * as BundleTestWorkerCached from '../BundleTestWorkerCached/BundleTestWorkerCached.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleWorkers = async ({ commitHash, platform, assetDir, version, date, product }) => {
  const rendererProcessCachePath = await BundleRendererProcessCached.bundleRendererProcessCached({
    commitHash,
    platform,
    assetDir,
  })
  await Copy.copy({
    from: rendererProcessCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/renderer-process`,
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
    to: `packages/build/.tmp/dist/${commitHash}/packages/renderer-worker`,
    ignore: ['static'],
  })
  const extensionHostWorkerCachePath = await BundleExtensionHostWorkerCached.bundleExtensionHostWorkerCached({
    commitHash,
    platform,
    assetDir,
  })
  await Copy.copy({
    from: extensionHostWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/extension-host-worker`,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(`packages/build/.tmp/dist/${commitHash}/packages/extension-host-sub-worker`),
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
    to: `packages/build/.tmp/dist/${commitHash}/packages/terminal-worker`,
  })
  const editorWorkerCachePath = await BundleEditorWorkerCached.bundleEditorWorkerCached({
    assetDir,
    platform,
    commitHash,
  })
  await Copy.copy({
    from: editorWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/editor-worker`,
  })
  const testWorkerCachePath = await BundleTestWorkerCached.bundleTestWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: testWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/test-worker`,
  })
  const diffWorkerCachePath = await BundleDiffWorkerCached.bundleDiffWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: diffWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/diff-worker`,
  })
  const syntaxHighlightingWorkerCachePath = await BundleSyntaxHighlightingWorkerCached.bundleSyntaxHighlightingWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: syntaxHighlightingWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/syntax-highlighting-worker`,
  })
  const iframeWorkerCachePath = await BundleIframeWorkerCached.bundleIframeWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: iframeWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/iframe-worker`,
  })
  const fileSearchWorkerCachePath = await BundleFileSearchWorkerCached.bundleFileSearchWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: fileSearchWorkerCachePath,
    to: `packages/build/.tmp/dist/${commitHash}/packages/file-search-worker`,
  })
  await Copy.copy({
    from: 'packages/shared-process/node_modules/@lvce-editor/preview-process/files/previewInjectedCode.js',
    to: `packages/build/.tmp/dist/${commitHash}/js/preview-injected.js`,
  })
}
