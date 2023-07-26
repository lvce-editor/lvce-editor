export const getModule = (type) => {
  switch (type) {
    case 'terminal-process':
      return import('../PassThroughElectronMessageForTerminalProcess/PassThroughElectronMessageForTerminalProcess.js')
    default:
      return undefined
  }
}
