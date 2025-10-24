import * as ViewletLayoutRenderDom from './ViewletLayoutRenderDom.ts'

export const hasFunctionalRender = true

const renderDom = {
  isEqual() {
    return false
  },
  apply(oldState, newState) {
    const commands = ViewletLayoutRenderDom.renderDom(oldState, newState)
    return commands
  },
  multiple: true,
}

export const render = [renderDom]
