import * as Path from '../Path/Path.cjs'
import * as Platform from '../Platform/Platform.cjs'
import * as Root from '../Root/Root.cjs'

export const getProcessExplorerUrl = () => {
  return `${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`
}

export const getProcessExplorerPreloadUrl = () => {
  return Path.join(Root.root, 'packages', 'main-process', 'pages', 'process-explorer', 'process-explorer-preload.js')
}
