import * as BundleAboutViewWorkerCached from '../BundleAboutViewWorkerCached/BundleAboutViewWorkerCached.js'
import * as BundleColorPickerWorkerCached from '../BundleColorPickerWorkerCached/BundleColorPickerWorkerCached.js'
import * as BundleDebugWorkerCached from '../BundleDebugWorkerCached/BundleDebugWorkerCached.js'
import * as BundleDiffWorkerCached from '../BundleDiffWorkerCached/BundleDiffWorkerCached.js'
import * as BundleEditorWorkerCached from '../BundleEditorWorkerCached/BundleEditorWorkerCached.js'
import * as BundleEmbedsWorkerCached from '../BundleEmbedsWorkerCached/BundleEmbedsWorkerCached.js'
import * as BundleErrorWorkerCached from '../BundleErrorWorkerCached/BundleErrorWorkerCached.js'
import * as BundleExplorerWorkerCached from '../BundleExplorerWorkerCached/BundleExplorerWorkerCached.js'
import * as BundleExtensionDetailViewWorkerCached from '../BundleExtensionDetailViewWorkerCached/BundleExtensionDetailViewWorkerCached.js'
import * as BundleExtensionHostSubWorkerCached from '../BundleExtensionHostSubWorkerCached/BundleExtensionHostSubWorkerCached.js'
import * as BundleExtensionHostWorkerCached from '../BundleExtensionHostWorkerCached/BundleExtensionHostWorkerCached.js'
import * as BundleExtensionSearchViewWorkerCached from '../BundleExtensionSearchViewWorkerCached/BundleExtensionSearchViewWorkerCached.js'
import * as BundleFileSearchWorkerCached from '../BundleFileSearchWorkerCached/BundleFileSearchWorkerCached.js'
import * as BundleIframeInspectorWorkerCached from '../BundleIframeInspectorWorkerCached/BundleIfameInspectorWorkerCached.js'
import * as BundleIframeWorkerCached from '../BundleIframeWorkerCached/BundleIframeWorkerCached.js'
import * as BundleKeyBindingsViewWorkerCached from '../BundleKeyBindingsViewWorkerCached/BundleKeyBindingsViewWorkerCached.js'
import * as BundleMarkdownWorkerCached from '../BundleMarkdownWorkerCached/BundleMarkdownWorkerCached.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as BundleSourceControlWorkerCached from '../BundleSourceControlWorkerCached/BundleSourceControlWorkerCached.js'
import * as BundleSyntaxHighlightingWorkerCached from '../BundleSyntaxHighlightingWorkerCached/BundleSyntaxHighlightingWorkerCached.js'
import * as BundleTerminalWorkerCached from '../BundleTerminalWorkerCached/BundleTerminalWorkerCached.js'
import * as BundleTestWorkerCached from '../BundleTestWorkerCached/BundleTestWorkerCached.js'
import * as BundleTextSearchWorkerCached from '../BundleTextSearchWorkerCached/BundleTextSearchWorkerCached.js'
import * as BundleTitleBarWorkerCached from '../BundleTitleBarWorkerCached/BundleTitleBarWorkerCached.js'
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

  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/find-widget-worker/dist/findWidgetWorkerMain.js',
    to: Path.join(`${toRoot}/packages/find-widget-worker`, 'dist', 'findWidgetWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/file-system-worker/dist/fileSystemWorkerMain.js',
    to: Path.join(`${toRoot}/packages/file-system-worker`, 'dist', 'fileSystemWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/menu-worker/dist/menuWorkerMain.js',
    to: Path.join(`${toRoot}/packages/menu-worker`, 'dist', 'menuWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/completion-worker/dist/completionWorkerMain.js',
    to: Path.join(`${toRoot}/packages/completion-worker`, 'dist', 'completionWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/rename-worker/dist/renameWorkerMain.js',
    to: Path.join(`${toRoot}/packages/rename-worker`, 'dist', 'renameWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/status-bar-worker/dist/statusBarWorkerMain.js',
    to: Path.join(`${toRoot}/packages/status-bar-worker`, 'dist', 'statusBarWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-management-worker/dist/extensionManagementWorkerMain.js',
    to: Path.join(`${toRoot}/packages/extension-management-worker`, 'dist', 'extensionManagementWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/main-area-worker/dist/mainAreaWorkerMain.js',
    to: Path.join(`${toRoot}/packages/main-area-worker`, 'dist', 'mainAreaWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/output-view/dist/outputViewWorkerMain.js',
    to: Path.join(`${toRoot}/packages/output-view`, 'dist', 'outputViewWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/language-models-view/dist/languageModelsViewMain.js',
    to: Path.join(`${toRoot}/packages/language-models-view`, 'dist', 'languageModelsViewMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/opener-worker/dist/openerWorkerMain.js',
    to: Path.join(`${toRoot}/packages/opener-worker`, 'dist', 'openerWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/icon-theme-worker/dist/iconThemeWorkerMain.js',
    to: Path.join(`${toRoot}/packages/icon-theme-worker`, 'dist', 'iconThemeWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/clipboard-worker/dist/clipBoardWorkerMain.js',
    to: Path.join(`${toRoot}/packages/clipboard-worker`, 'dist', 'clipBoardWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/activity-bar-worker/dist/activityBarWorkerMain.js',
    to: Path.join(`${toRoot}/packages/activity-bar-worker`, 'dist', 'activityBarWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/update-worker/dist/updateWorkerMain.js',
    to: Path.join(`${toRoot}/packages/update-worker`, 'dist', 'updateWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/quick-pick-worker/dist/quickPickWorkerMain.js',
    to: Path.join(`${toRoot}/packages/quick-pick-worker`, 'dist', 'quickPickWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/preview-worker/dist/previewWorkerMain.js',
    to: Path.join(`${toRoot}/packages/preview-worker`, 'dist', 'previewWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/preview-sandbox-worker/dist/previewSandBoxWorkerMain.js',
    to: Path.join(`${toRoot}/packages/preview-sandbox-worker`, 'dist', 'previewSandBoxWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/text-measurement-worker/dist/textMeasurementWorkerMain.js',
    to: Path.join(`${toRoot}/packages/text-measurement-worker`, 'dist', 'textMeasurementWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/hover-worker/dist/hoverWorkerMain.js',
    to: Path.join(`${toRoot}/packages/hover-worker`, 'dist', 'hoverWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/references-view/dist/referencesViewWorkerMain.js',
    to: Path.join(`${toRoot}/packages/references-view`, 'dist', 'referencesViewWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/problems-view/dist/problemsViewWorkerMain.js',
    to: Path.join(`${toRoot}/packages/problems-view`, 'dist', 'problemsViewWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/panel-worker/dist/panelWorkerMain.js',
    to: Path.join(`${toRoot}/packages/panel-worker`, 'dist', 'panelWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/settings-view/dist/settingsViewWorkerMain.js',
    to: Path.join(`${toRoot}/packages/settings-view`, 'dist', 'settingsViewWorkerMain.js'),
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/source-action-worker/dist/sourceActionWorkerMain.js',
    to: Path.join(`${toRoot}/packages/source-action-worker`, 'dist', 'sourceActionWorkerMain.js'),
  })
  const sourceControlWorkerCachePath = await BundleSourceControlWorkerCached.bundleSourceControlWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: sourceControlWorkerCachePath,
    to: `${toRoot}/packages/source-control-worker`,
  })
  const colorPickerWorkerCachePath = await BundleColorPickerWorkerCached.bundleColorPickerWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: colorPickerWorkerCachePath,
    to: `${toRoot}/packages/color-picker-worker`,
  })
  const debugWorkerCachePath = await BundleDebugWorkerCached.bundleDebugWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: debugWorkerCachePath,
    to: `${toRoot}/packages/debug-worker`,
  })
  const errorWorkerCachePath = await BundleErrorWorkerCached.bundleErrorWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: errorWorkerCachePath,
    to: `${toRoot}/packages/error-worker`,
  })
  const iframeInspectorWorkerCachePath = await BundleIframeInspectorWorkerCached.bundleIframeInspectorWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: iframeInspectorWorkerCachePath,
    to: `${toRoot}/packages/iframe-inspector`,
  })

  const explorerWorkerCachePath = await BundleExplorerWorkerCached.bundleExplorerWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: explorerWorkerCachePath,
    to: `${toRoot}/packages/explorer-worker`,
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

  const markdownWorkerCachePath = await BundleMarkdownWorkerCached.bundleMarkdownWorkerCached({
    assetDir,
    commitHash,
    platform,
    date,
    product,
    version,
  })
  await Copy.copy({
    from: markdownWorkerCachePath,
    to: `${toRoot}/packages/markdown-worker`,
  })

  const titleBarWorkerCachePath = await BundleTitleBarWorkerCached.bundleTitleBarWorkerCached({
    assetDir,
    commitHash,
    platform,
    date,
    product,
    version,
  })
  await Copy.copy({
    from: titleBarWorkerCachePath,
    to: `${toRoot}/packages/title-bar-worker`,
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

  const extensionDetailViewWorkerCachePath = await BundleExtensionDetailViewWorkerCached.bundleExtensionDetailViewWorkerCached({
    assetDir,
    commitHash,
    platform,
  })
  await Copy.copy({
    from: extensionDetailViewWorkerCachePath,
    to: `${toRoot}/packages/extension-detail-view-worker`,
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

  await Copy.copyFile({
    from: 'packages/shared-process/node_modules/@lvce-editor/preload/src/index.js',
    to: Path.join(`${toRoot}/packages/preload`, 'dist', 'index.js'),
  })
}
