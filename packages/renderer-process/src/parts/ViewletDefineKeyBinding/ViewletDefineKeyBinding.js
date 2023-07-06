import * as Assert from '../Assert/Assert.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletDefineKeyBindingEvents from './ViewletDefineKeyBindingEvents.js'

export const create = () => {
  const $Input = InputBox.create()
  $Input.autofocus = true

  const $Heading = document.createElement('h3')
  $Heading.className = 'DefineKeyBindingHeading'
  $Heading.textContent = 'Press Desired Key Combination, Then Press Enter'

  const $Content = document.createElement('div')
  $Content.className = 'DefineKeyBindingContent'
  $Content.append($Heading, $Input)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DefineKeyBinding'
  $Viewlet.append($Content)

  return {
    $Viewlet,
    $Input,
  }
}

export const attachEvents = (state) => {
  const { $Input } = state
  $Input.onkeydown = ViewletDefineKeyBindingEvents.handleKeyDown
}

export const setValue = (state, value) => {
  Assert.object(state)
  Assert.string(value)
  const { $Input } = state
  $Input.value = value
}

export const focus = (state) => {
  const { $Input } = state
  $Input.focus()
}
