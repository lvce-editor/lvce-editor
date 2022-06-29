import * as Command from '../Command/Command.js'
import * as RenderFrameWork from './RenderFrameWork.js'

export const __initialize__ = () => {
  Command.register(4411, RenderFrameWork.createElementNode)
  Command.register(4412, RenderFrameWork.createTextNode)
  Command.register(4413, RenderFrameWork.focus)
  Command.register(4414, RenderFrameWork.renderVirtualDom)
}
