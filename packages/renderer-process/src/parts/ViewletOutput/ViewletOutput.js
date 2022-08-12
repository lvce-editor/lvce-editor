import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Focus from '../Focus/Focus.js'
import * as Assert from '../Assert/Assert.js'

const create$Option = (option) => {
  const $Option = document.createElement('option')
  $Option.value = option.file
  $Option.textContent = option.name
  return $Option
}

// TODO name export not necessary
export const name = 'Output'

const handleChange = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* viewletSend */ 'Viewlet.send',
    /* ViewletId */ 'Output',
    /* method */ 'setOutputChannel',
    /* option */ value
  )
}

export const create = () => {
  const $ViewletOutputSelect = document.createElement('select')
  $ViewletOutputSelect.className = 'ViewletOutputSelect'
  $ViewletOutputSelect.onchange = handleChange
  $ViewletOutputSelect.ariaLabel = 'Select a log'
  const $ViewletOutputContent = document.createElement('div')
  $ViewletOutputContent.className = 'OutputContent'
  $ViewletOutputContent.setAttribute('role', 'log')
  $ViewletOutputContent.tabIndex = 0
  const $ViewletOutputWidgets = document.createElement('div')
  $ViewletOutputWidgets.className = 'OutputWidgets'
  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Output'
  $Viewlet.className = 'Viewlet ViewletOutput'
  $Viewlet.tabIndex = 0
  $Viewlet.append(
    $ViewletOutputSelect,
    $ViewletOutputContent,
    $ViewletOutputWidgets
  )
  return {
    $Viewlet,
    select: $ViewletOutputSelect,
    $Select: $ViewletOutputSelect,
    content: $ViewletOutputContent,
    $Content: $ViewletOutputContent,
    $ViewletOutputContent,
  }
}

export const setOptions = (state, options) => {
  state.$Select.append(...options.map(create$Option))
}

export const append = (state, text) => {
  Assert.object(state)
  Assert.string(text)
  const $Line = document.createElement('div')
  $Line.textContent = text
  state.content.append($Line)
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
  Focus.focus(state.$ViewletOutputContent, 'output')
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
