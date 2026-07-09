import * as Platform from '../Platform/Platform.ts'

export const getProcessExplorerUrl = () => {
  return `${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`
}
