import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const create$Option = (option) => {
  const $Option = document.createElement('option')
  $Option.value = option.file
  $Option.textContent = option.name
  return $Option
}

export const create = () => {
  const $ViewletOutputContent = document.createElement('div')
  $ViewletOutputContent.className = 'OutputContent'
  $ViewletOutputContent.role = AriaRoles.Log
  $ViewletOutputContent.tabIndex = 0
  const $ViewletOutputWidgets = document.createElement('div')
  $ViewletOutputWidgets.className = 'OutputWidgets'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Output'
  $Viewlet.tabIndex = 0
  $Viewlet.append($ViewletOutputContent, $ViewletOutputWidgets)
  return {
    $Viewlet,
    content: $ViewletOutputContent,
    $Content: $ViewletOutputContent,
    $ViewletOutputContent,
  }
}

export const setText = (state, text) => {
  Assert.object(state)
  Assert.string(text)
  state.content.textContent = text
}

export const clear = (state) => {
  Assert.object(state)
  state.content.textContent = ''
}

export const handleError = (state, error) => {
  Assert.object(state)
  Assert.string(error)
  state.content.textContent = error
}

export const focus = (state) => {
  Assert.object(state)
  Focus.focus(state.$ViewletOutputContent)
  RendererWorker.send('Focus.setFocus', 'focus.output')
}

// TODO handle case when output is opened -> find widget is opened -> output is disposed before find widget is ready
export const openFindWidget = (state) => {
  // Command.execute(findWidget.create)
}

export const disposeFindWidget = (state) => {
  if (!state.findWidget) {
    return
  }

  // Command.execute(FindWidget.dispose, state.findWidget)
  state.findWidget
}

export const dispose = (state) => {}
