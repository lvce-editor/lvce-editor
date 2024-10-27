import * as BundleAboutViewWorkerCached from '../BundleAboutViewWorkerCached/BundleAboutViewWorkerCached.js'
import * as BundleDiffWorkerCached from '../BundleDiffWorkerCached/BundleDiffWorkerCached.js'
import * as BundleEditorWorkerCached from '../BundleEditorWorkerCached/BundleEditorWorkerCached.js'
import * as BundleEmbedsWorkerCached from '../BundleEmbedsWorkerCached/BundleEmbedsWorkerCached.js'
import * as BundleExtensionHostSubWorkerCached from '../BundleExtensionHostSubWorkerCached/BundleExtensionHostSubWorkerCached.js'
import * as BundleExtensionHostWorkerCached from '../BundleExtensionHostWorkerCached/BundleExtensionHostWorkerCached.js'
import * as BundleFileSearchWorkerCached from '../BundleFileSearchWorkerCached/BundleFileSearchWorkerCached.js'
import * as BundleIframeWorkerCached from '../BundleIframeWorkerCached/BundleIframeWorkerCached.js'
import * as BundleKeyBindingsViewWorkerCached from '../BundleKeyBindingsViewWorkerCached/BundleKeyBindingsViewWorkerCached.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as BundleSyntaxHighlightingWorkerCached from '../BundleSyntaxHighlightingWorkerCached/BundleSyntaxHighlightingWorkerCached.js'
import * as BundleTerminalWorkerCached from '../BundleTerminalWorkerCached/BundleTerminalWorkerCached.js'
import * as BundleTestWorkerCached from '../BundleTestWorkerCached/BundleTestWorkerCached.js'
import * as BundleExtensionSearchViewWorkerCached from '../BundleExtensionSearchViewWorkerCached/BundleExtensionSearchViewWorkerCached.js'
import * as BundleTextSearchWorkerCached from '../BundleTextSearchWorkerCached/BundleTextSearchWorkerCached.js'
import * as Copy from '../Copy/Copy.js'

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

  const extensionHostSubWorkerCachePath = await BundleExtensionHostSubWorkerCached.bundleExtensionHostSubWorkerCached({
    commitHash,
    platform: 'electron',
    assetDir: `../../../../..`,
  })

  console.time('copyExtensionHostSubWorkerFiles')
  await Copy.copy({
    from: extensionHostSubWorkerCachePath,
    to: `${toRoot}/packages/extension-host-sub-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyExtensionHostSubWorkerFiles')

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

  const keyBindingsViewWorkerCachePath = await BundleKeyBindingsViewWorkerCached.bundleKeyBindingsViewWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: keyBindingsViewWorkerCachePath,
    to: `${toRoot}/packages/keybindings-view-worker`,
  })

  const aboutViewWorkerCachePath = await BundleAboutViewWorkerCached.bundleAboutViewWorkerCached({
    assetDir,
    commitHash,
    platform,
    date,
    product,
    version,
  })
  await Copy.copy({
    from: aboutViewWorkerCachePath,
    to: `${toRoot}/packages/about-view-worker`,
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

  const extensionSearchViewWorkerCachePath = await BundleExtensionSearchViewWorkerCached.bundleExtensionSearchViewWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: extensionSearchViewWorkerCachePath,
    to: `${toRoot}/packages/extension-search-view-worker`,
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

  const textSearchWorkerCachePath = await BundleTextSearchWorkerCached.bundleTextSearchWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: textSearchWorkerCachePath,
    to: `${toRoot}/packages/text-search-worker`,
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

  await Copy.copy({
    from: 'packages/shared-process/node_modules/@lvce-editor/preview-process/files/previewInjectedCode.js',
    to: `${toRoot}/js/preview-injected.js`,
  })
}
