import * as ExtensionManagement from './ExtensionManagement.js'
import * as ExtensionHostSourceControl from '../ExtensionHost/ExtensionHostSourceControl.js'

export const name = 'ExtensionManagement'

export const Commands = {
  'ExtensionHostManagement.activateByEvent': ExtensionManagement.activateByEvent,
  'ExtensionHostSourceControl.acceptInput': ExtensionHostSourceControl.acceptInput,
  'ExtensionHostSourceControl.add': ExtensionHostSourceControl.add,
  'ExtensionHostSourceControl.discard': ExtensionHostSourceControl.discard,
  'ExtensionHostSourceControl.generateCommitMessage': ExtensionHostSourceControl.generateCommitMessage,
  'ExtensionHostSourceControl.getBadgeCount': ExtensionHostSourceControl.getBadgeCount,
  'ExtensionHostSourceControl.getChangedFiles': ExtensionHostSourceControl.getChangedFiles,
  'ExtensionHostSourceControl.getEnabledProviderIds': ExtensionHostSourceControl.getEnabledProviderIds,
  'ExtensionHostSourceControl.getFeatures': ExtensionHostSourceControl.getFeatures,
  'ExtensionHostSourceControl.getFileBefore': ExtensionHostSourceControl.getFileBefore,
  'ExtensionHostSourceControl.getFileDecorations': ExtensionHostSourceControl.getFileDecorations,
  'ExtensionHostSourceControl.getGroups': ExtensionHostSourceControl.getGroups,
  'ExtensionHostSourceControl.getIconDefinitions': ExtensionHostSourceControl.getIconDefinitions,
  activateByEvent: ExtensionManagement.activateByEvent,
  disable: ExtensionManagement.disable,
  enable: ExtensionManagement.enable,
  getAllExtensions: ExtensionManagement.getAllExtensions,
  getExtension: ExtensionManagement.getExtension2,
  getExtensions: ExtensionManagement.getAllExtensions,
  getExtensionsEtag: ExtensionManagement.getExtensionsEtag,
  getRunningExtensions: ExtensionManagement.getRunningExtensions,
  handleExtensionsCacheInvalidated: ExtensionManagement.handleExtensionsCacheInvalidated,
  handleExtensionStatusUpdate: ExtensionManagement.handleExtensionStatusUpdate,
  handleViewContextChange: ExtensionManagement.handleViewContextChange,
  showViewContextMenu: ExtensionManagement.showViewContextMenu,
  uninstall: ExtensionManagement.uninstall,
  invalidateExtensionsCache: ExtensionManagement.handleExtensionsCacheInvalidated,
}
