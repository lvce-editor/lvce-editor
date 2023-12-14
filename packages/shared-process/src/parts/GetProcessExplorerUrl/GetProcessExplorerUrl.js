import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'

export const getProcessExplorerUrl = () => {
  return `${Platform.scheme}://-/packages/main-process/pages/process-explorer/process-explorer.html`
}

export const getProcessExplorerPreloadUrl = () => {
  return Path.join(Root.root, 'packages', 'main-process', 'src', 'preload.js')
}
