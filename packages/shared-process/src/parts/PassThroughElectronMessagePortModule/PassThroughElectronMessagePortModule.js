export const getModule = (type) => {
  switch (type) {
    case 'extension-host':
      return import('../PassThroughMessagePortForExtensionHost/PassThroughMessagePortForExtensionHost.js')
    case 'extension-host-helper-process':
      return import('../PassThroughMessagePortForExtensionHostHelperProcess/PassThroughMessagePortForExtensionHostHelperProcess.js')
    case 'terminal-process':
      return import('../PassThroughMessagePortForTerminalProcess/PassThroughMessagePortForTerminalProcess.js')
    default:
      if (type.startsWith('custom:')) {
        return import('../PassThroughMessagePortForCustom/PassThroughMessagePortForCustom.js')
      }
      return undefined
  }
}
