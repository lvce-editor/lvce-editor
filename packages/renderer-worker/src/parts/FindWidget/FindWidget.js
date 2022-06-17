import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Id from '../Id/Id.js'

export const state = {
  activeWidget: undefined,
}

export const create = ({ getText }) => {
  state.activeWidget = {
    id: Id.create(),
    searchValue: '',
    // TODO how does find widget get text from editor? Both are complete separated
    // textContent: '',
    getText,
  }
  RendererProcess.send([
    /* FindWidget.create */ 4100,
    /* id */ state.activeWidget.id,
  ])
}

const update = async (widget) => {
  const results = []
  const text = widget.getText()
  for (let i = 0; i < widget.textContent.length; i++) {
    if (text.slice(i).startsWith(widget.searchValue)) {
      results.push(i)
    }
  }
  RendererProcess.send([
    /* findWidgetSetResults */ 4103,
    /* id */ widget.id,
    /* results */ results,
  ])
}

export const setValue = async (value) => {
  state.activeWidget.value = value
  update(state.activeWidget)
}

export const previousMatch = () => {}

export const nextMatch = () => {}

export const dispose = () => {
  if (!state.activeWidget) {
    return
  }
  RendererProcess.send([
    /* FindWidget.dispose */ 4102,
    /* id */ state.activeWidget.id,
  ])
  state.activeWidget = undefined
}
