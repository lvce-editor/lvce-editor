import * as WrapDiffViewCommand from '../WrapDiffViewCommand/WrapDiffViewCommand.ts'
import * as ViewletDiffEditor2 from './ViewletDiffEditor2.js'

export const Commands = {
  setDeltaY: WrapDiffViewCommand.wrapDiffViewCommand('setDeltaY'),
  handleWheel: WrapDiffViewCommand.wrapDiffViewCommand('handleWheel'),
  hotReload: ViewletDiffEditor2.hotReload,
}
