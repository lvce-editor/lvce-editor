import * as CachingHeaders from '../CachingHeaders/CachingHeaders.js'
import * as GetHeadersAboutWorker from '../GetHeadersAboutWorker/GetHeadersAboutWorker.js'
import * as GetHeadersActivityBarWorker from '../GetHeadersActivityBarWorker/GetHeadersActivityBarWorker.js'
import * as GetHeadersClipBoardWorker from '../GetHeadersClipBoardWorker/GetHeadersClipBoardWorker.js'
import * as GetHeadersColorPickerWorker from '../GetHeadersColorPickerWorker/GetHeadersColorPickerWorker.js'
import * as GetHeadersCompletionWorker from '../GetHeadersCompletionWorker/GetHeadersCompletionWorker.js'
import * as GetHeadersDebugWorker from '../GetHeadersDebugWorker/GetHeadersDebugWorker.js'
import * as GetHeadersDefault from '../GetHeadersDefault/GetHeadersDefault.js'
import * as GetHeadersDocument from '../GetHeadersDocument/GetHeadersDocument.js'
import * as GetHeadersEditorWorker from '../GetHeadersEditorWorker/GetHeadersEditorWorker.js'
import * as GetHeadersEmbedsWorker from '../GetHeadersEmbedsWorker/GetHeadersEmbedsWorker.js'
import * as GetHeadersErrorWorker from '../GetHeadersErrorWorker/GetHeadersErrorWorker.js'
import * as GetHeadersExplorerWorker from '../GetHeadersExplorerWorker/GetHeadersExplorerWorker.js'
import * as GetHeadersExtensionDetailViewWorker from '../GetHeadersExtensionDetailViewWorker/GetHeadersExtensionDetailViewWorker.js'
import * as GetHeadersExtensionHostSubWorker from '../GetHeadersExtensionHostSubWorker/GetHeadersExtensionHostSubWorker.js'
import * as GetHeadersExtensionHostWorker from '../GetHeadersExtensionHostWorker/GetHeadersExtensionHostWorker.js'
import * as GetHeadersExtensionManagementWorker from '../GetHeadersExtensionManagementWorker/GetHeadersExtensionManagementWorker.js'
import * as GetHeadersQuickPickWorker from '../GetHeadersQuickPickWorker/GetHeadersQuickPickWorker.js'
import * as GetHeadersExtensionSearchViewWorker from '../GetHeadersExtensionSearchViewWorker/GetHeadersExtensionSearchViewWorker.js'
import * as GetHeadersFileSearchWorker from '../GetHeadersFileSearchWorker/GetHeadersFileSearchWorker.js'
import * as GetHeadersFileSystemWorker from '../GetHeadersFileSystemWorker/GetHeadersFileSystemWorker.js'
import * as GetHeadersFindWidgetWorker from '../GetHeadersFindWidgetWorker/GetHeadersFindWidgetWorker.js'
import * as GetHeadersHoverWorker from '../GetHeadersHoverWorker/GetHeadersHoverWorker.js'
import * as GetHeadersIconThemeWorker from '../GetHeadersIconThemeWorker/GetHeadersIconThemeWorker.js'
import * as GetHeadersIframeInspectorWorker from '../GetHeadersIframeInspectorWorker/GetHeadersIframeInspectorWorker.js'
import * as GetHeadersIframeWorker from '../GetHeadersIframeWorker/GetHeadersIframeWorker.js'
import * as GetHeadersKeyBindingsViewWorker from '../GetHeadersKeyBindingsViewWorker/GetHeadersKeyBindingsViewWorker.js'
import { getHeadersLanguageModelsView } from '../GetHeadersLanguageModelsView/GetHeadersLanguageModelsView.js'
import * as GetHeadersMainAreaWorker from '../GetHeadersMainAreaWorker/GetHeadersMainAreaWorker.js'
import * as GetHeadersMarkdownWorker from '../GetHeadersMarkdownWorker/GetHeadersMarkdownWorker.js'
import * as GetHeadersMenuWorker from '../GetHeadersMenuWorker/GetHeadersMenuWorker.js'
import * as GetHeadersOpenerWorker from '../GetHeadersOpenerWorker/GetHeadersOpenerWorker.js'
import * as GetHeadersOutputViewWorker from '../GetHeadersOutputViewWorker/GetHeadersOutputViewWorker.js'
import * as GetHeadersPanelWorker from '../GetHeadersPanelWorker/GetHeadersPanelWorker.js'
import * as GetHeadersPreviewSandBoxWorker from '../GetHeadersPreviewSandBoxWorker/GetHeadersPreviewSandBoxWorker.js'
import * as GetHeadersPreviewWorker from '../GetHeadersPreviewWorker/GetHeadersPreviewWorker.js'
import * as GetHeadersProblemsWorker from '../GetHeadersProblemsWorker/GetHeadersProblemsWorker.js'
import * as GetHeadersReferencesViewWorker from '../GetHeadersReferencesViewWorker/GetHeadersReferencesViewWorker.js'
import * as GetHeadersRenameWorker from '../GetHeadersRenameWorker/GetHeadersRenameWorker.js'
import * as GetHeadersRendererWorker from '../GetHeadersRendererWorker/GetHeadersRendererWorker.js'
import * as GetHeadersSearchViewWorker from '../GetHeadersSearchViewWorker/GetHeadersSearchViewWorker.js'
import * as GetHeadersSettingsWorker from '../GetHeadersSettingsWorker/GetHeadersSettingsWorker.js'
import * as GetHeadersSourceActionWorker from '../GetHeadersSourceActionWorker/GetHeadersSourceActionWorker.js'
import * as GetHeadersSourceControlWorker from '../GetHeadersSourceControlWorker/GetHeadersSourceControlWorker.js'
import * as GetHeadersStatusBarWorker from '../GetHeadersStatusBarWorker/GetHeadersStatusBarWorker.js'
import * as GetHeadersSyntaxHighlightingWorker from '../GetHeadersSyntaxHighlightingWorker/GetHeadersSyntaxHighlightingWorker.js'
import * as GetHeadersTerminalWorker from '../GetHeadersTerminalWorker/GetHeadersTerminalWorker.js'
import * as GetHeadersTestWorker from '../GetHeadersTestWorker/GetHeadersTestWorker.js'
import * as GetHeadersTextMeasurementWorker from '../GetHeadersTextMeasurementWorker/GetHeadersTextMeasurementWorker.js'
import * as GetHeadersTextSearchWorker from '../GetHeadersTextSearchWorker/GetHeadersTextSearchWorker.js'
import * as GetHeadersTitleBarWorker from '../GetHeadersTitleBarWorker/GetHeadersTitleBarWorker.js'
import * as GetHeadersUpdateWorker from '../GetHeadersUpdateWorker/GetHeadersUpdateWorker.js'
import * as GetMimeType from '../GetMimeType/GetMimeType.js'
import * as Path from '../Path/Path.js'

export const getHeaders = ({ absolutePath, etag, isImmutable, isForElectronProduction, applicationName }) => {
  const extension = Path.extname(absolutePath)
  const mime = GetMimeType.getMimeType(extension)
  const defaultCachingHeader = isImmutable ? CachingHeaders.OneYear : CachingHeaders.NoCache
  if (absolutePath.endsWith('index.html')) {
    return GetHeadersDocument.getHeadersDocument({ mime, etag, isForElectronProduction, applicationName })
  }
  if (absolutePath.endsWith('rendererWorkerMain.js') || absolutePath.endsWith('rendererWorkerMain.ts')) {
    return GetHeadersRendererWorker.getHeadersRendererWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('statusBarWorkerMain.js')) {
    return GetHeadersStatusBarWorker.getHeadersStatusBarWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostWorkerMain.js')) {
    return GetHeadersExtensionHostWorker.getHeadersExtensionHostWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('terminalWorkerMain.js')) {
    return GetHeadersTerminalWorker.getHeadersTerminalWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('outputViewWorkerMain.js')) {
    return GetHeadersOutputViewWorker.getHeadersOutputViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('openerWorkerMain.js')) {
    return GetHeadersOpenerWorker.getHeadersOpenerBarWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('editorWorkerMain.js')) {
    return GetHeadersEditorWorker.getHeadersEditorWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('quickPickWorkerMain.js')) {
    return GetHeadersQuickPickWorker.getHeadersQuickPickWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('previewSandboxWorkerMain.js') || absolutePath.endsWith('previewSandBoxWorkerMain.js')) {
    return GetHeadersPreviewSandBoxWorker.getHeadersPreviewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('menuWorkerMain.js')) {
    return GetHeadersMenuWorker.getHeadersMenuWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('updateWorkerMain.js')) {
    return GetHeadersUpdateWorker.getHeadersUpdateWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('mainAreaWorkerMain.js')) {
    return GetHeadersMainAreaWorker.getHeadersMainAreaWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('languageModelsViewMain.js')) {
    return getHeadersLanguageModelsView(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('panelWorkerMain.js')) {
    return GetHeadersPanelWorker.getHeadersPanelWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('textMeasurementWorkerMain.js')) {
    return GetHeadersTextMeasurementWorker.getHeadersTextMeasurementWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionSearchViewWorkerMain.js')) {
    return GetHeadersExtensionSearchViewWorker.getHeadersExtensionSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('errorWorkerMain.js')) {
    return GetHeadersErrorWorker.getHeadersErrorWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionManagementWorkerMain.js')) {
    return GetHeadersExtensionManagementWorker.getHeadersExtensionManagementWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionDetailViewWorkerMain.js')) {
    return GetHeadersExtensionDetailViewWorker.getHeadersExtensionDetailViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('iframeWorkerMain.js')) {
    return GetHeadersIframeWorker.getHeadersIframeWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('hoverWorkerMain.js')) {
    return GetHeadersHoverWorker.getHeadersHoverWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('embedsWorkerMain.js')) {
    return GetHeadersEmbedsWorker.getHeadersEmbedsWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('iframeInspectorWorkerMain.js')) {
    return GetHeadersIframeInspectorWorker.getHeadersIframeInspectorWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('fileSearchWorkerMain.js')) {
    return GetHeadersFileSearchWorker.getHeadersFileSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('fileSystemWorkerMain.js')) {
    return GetHeadersFileSystemWorker.getHeadersFileSystemWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('textSearchWorkerMain.js')) {
    return GetHeadersTextSearchWorker.getHeadersTextSearchWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('settingsViewWorkerMain.js')) {
    return GetHeadersSettingsWorker.getHeadersSettingsWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('aboutWorkerMain.js')) {
    return GetHeadersAboutWorker.getHeadersAboutWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('previewWorkerMain.js')) {
    return GetHeadersPreviewWorker.getHeadersPreviewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('clipBoardWorkerMain.js')) {
    return GetHeadersClipBoardWorker.getHeadersClipBoardWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('iconThemeWorkerMain.js')) {
    return GetHeadersIconThemeWorker.getHeadersIconThemeWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('sourceControlWorkerMain.js')) {
    return GetHeadersSourceControlWorker.getHeadersSourceControlWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('explorerViewWorkerMain.js')) {
    return GetHeadersExplorerWorker.getHeadersExplorerWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('testWorkerMain.js')) {
    return GetHeadersTestWorker.getHeadersTestWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('sourceActionWorkerMain.js')) {
    return GetHeadersSourceActionWorker.getHeadersSourceActionWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('debugWorkerMain.js')) {
    return GetHeadersDebugWorker.getHeadersDebugWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('syntaxHighlightingWorkerMain.js')) {
    return GetHeadersSyntaxHighlightingWorker.getHeadersSyntaxHighlightingWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('searchViewWorkerMain.js')) {
    return GetHeadersSearchViewWorker.getHeadersSearchViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('referencesViewWorkerMain.js')) {
    return GetHeadersReferencesViewWorker.getHeadersReferenceViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('extensionHostSubWorkerMain.js')) {
    return GetHeadersExtensionHostSubWorker.getHeadersExtensionHostSubWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('keyBindingsViewWorkerMain.js')) {
    return GetHeadersKeyBindingsViewWorker.getHeadersKeyBindingsViewWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('markdownWorkerMain.js')) {
    return GetHeadersMarkdownWorker.getHeadersMarkdownWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('problemsViewWorkerMain.js')) {
    return GetHeadersProblemsWorker.getHeadersProblemsWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('titleBarWorkerMain.js')) {
    return GetHeadersTitleBarWorker.getHeadersTitleBarWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('colorPickerWorkerMain.js')) {
    return GetHeadersColorPickerWorker.getHeadersColorPickerWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('completionWorkerMain.js')) {
    return GetHeadersCompletionWorker.getHeadersCompletionWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('renameWorkerMain.js')) {
    return GetHeadersRenameWorker.getHeadersRenameWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('findWidgetWorkerMain.js')) {
    return GetHeadersFindWidgetWorker.getHeadersFindWidgetWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('activityBarWorkerMain.js')) {
    return GetHeadersActivityBarWorker.getHeadersActivityBarWorker(mime, etag, defaultCachingHeader)
  }
  if (absolutePath.endsWith('workerMain.js')) {
    console.log({ absolutePath, headers: GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader) })
  }
  return GetHeadersDefault.getHeadersDefault(mime, etag, defaultCachingHeader)
}
