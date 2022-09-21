import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import { getBaseName } from '../Path/Path.js'
import * as Viewlet from '../Viewlet/Viewlet.js' // TODO should not import viewlet manager -> avoid cyclic dependency
import { updateRoot } from './ViewletExplorerUpdateRoot.js'
import * as Path from '../Path/Path.js'

const handlePasteNone = (state, nativeFiles) => {
  console.info('[ViewletExplorer/handlePaste] no paths detected')
  return state
}
const handlePasteCopy = async (state, nativeFiles) => {
  // TODO handle pasting files into nested folder
  // TODO handle pasting files into symlink
  // TODO handle pasting files into broken symlink
  // TODO handle pasting files into hardlink
  // TODO what if folder is big and it takes a long time
  for (const source of nativeFiles.files) {
    const target = Path.join(
      state.pathSeperator,
      state.root,
      getBaseName(state.pathSeparator, source)
    )
    await FileSystem.copy(source, target)
  }
  const stateNow = Viewlet.getState('Explorer')
  if (stateNow.disposed) {
    return
  }
  // TODO only update folder at which level it changed
  return updateRoot()
}

const handlePasteCut = async (state, nativeFiles) => {
  for (const source of nativeFiles.files) {
    const target = `${state.root}${state.pathSeparator}${getBaseName(
      state.pathSeparator,
      source
    )}`
    await FileSystem.rename(source, target)
  }
  return state
}

const NativeFileTypes = {
  None: 'none',
  Copy: 'copy',
  Cut: 'cut',
}

export const handlePaste = async (state) => {
  const nativeFiles = await Command.execute(
    /* ClipBoard.readNativeFiles */ 'ClipBoard.readNativeFiles'
  )
  // TODO detect cut/paste event, not sure if that is possible
  // TODO check that pasted folder is not a parent folder of opened folder
  // TODO support pasting multiple paths
  // TODO what happens when pasting multiple paths, but some of them error?
  // how many error messages should be shown? Should the operation be undone?
  // TODO what if it is a large folder and takes a long time to copy? Should show progress
  // TODO what if there is a permission error? Probably should show a modal to ask for permission
  // TODO if error is EEXISTS, just rename the copy (e.g. file-copy-1.txt, file-copy-2.txt)
  // TODO actual target should be selected folder
  // TODO but what if a file is currently selected? Then maybe the parent folder
  // TODO but will it work if the folder is a symlink?
  // TODO handle error gracefully when copy fails
  switch (nativeFiles.type) {
    case NativeFileTypes.None:
      return handlePasteNone(state, nativeFiles)
    case NativeFileTypes.Copy:
      return handlePasteCopy(state, nativeFiles)
    case NativeFileTypes.Cut:
      return handlePasteCut(state, nativeFiles)
    default:
      throw new Error(`unexpected native paste type: ${nativeFiles.type}`)
  }
}
