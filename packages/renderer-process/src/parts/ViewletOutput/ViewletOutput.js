import * as Focus from '../Focus/Focus.js'
import * as Assert from '../Assert/Assert.js'
import * as ViewletOutputEvents from './ViewletOutputEvents.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

// TODO name export not necessary
export const name = ViewletModuleId.Output

/**
 * @enum {string}
 */
const UiStrings = {
  SelectALog: 'Select a Log',
}

const create$Option = (option) => {
  const $Option = document.createElement('option')
  $Option.value = option.file
  $Option.textContent = option.name
  return $Option
}

export const create = () => {
  const $ViewletOutputSelect = document.createElement('select')
  $ViewletOutputSelect.className = 'ViewletOutputSelect'
  $ViewletOutputSelect.onchange = ViewletOutputEvents.handleChange
  $ViewletOutputSelect.ariaLabel = UiStrings.SelectALog
  const $ViewletOutputContent = document.createElement('div')
  $ViewletOutputContent.className = 'OutputContent'
  // @ts-ignore
  $ViewletOutputContent.role = 'log'
  $ViewletOutputContent.tabIndex = 0
  const $ViewletOutputWidgets = document.createElement('div')
  $ViewletOutputWidgets.className = 'OutputWidgets'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Output'
  $Viewlet.tabIndex = 0
  $Viewlet.append(
    $ViewletOutputSelect,
    $ViewletOutputContent,
    $ViewletOutputWidgets
  )
  return {
    $Viewlet,
    $Select: $ViewletOutputSelect,
    $Content: $ViewletOutputContent,
  }
}

export const setOptions = (state, options) => {
  console.log({ options })
  const { $Select } = state
  $Select.append(...options.map(create$Option))
}

export const setText = (state, text) => {
  Assert.object(state)
  Assert.string(text)
  const { $Content } = state
  const $Line = document.createElement('div')
  $Line.textContent = text
  $Content.append($Line)
}

export const handleError = (state, error) => {
  Assert.object(state)
  Assert.string(error)
  const { $Content } = state
  $Content.textContent = error
}

export const focus = (state) => {
  Assert.object(state)
  const { $Content } = state
  Focus.focus($Content, 'output')
}
