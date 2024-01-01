import * as Platform from '../Platform/Platform.js'

export const getProcessExplorerUrl = () => {
  return `${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`
}
