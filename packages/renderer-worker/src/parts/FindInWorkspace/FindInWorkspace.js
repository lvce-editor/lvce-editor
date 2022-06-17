import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Workspace from '../Workspace/Workspace.js'

export const findInWorkspace = async (searchTerm) => {
  // TODO ask shared process
  const root = Workspace.state.workspacePath
  const result = await SharedProcess.invoke(
    /* Search.search */ 'Search.search',
    /* folder */ root,
    /* searchTerm */ searchTerm
  )
  return result
}
