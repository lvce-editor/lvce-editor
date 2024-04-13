import * as Assert from '../Assert/Assert.ts'
export * as Events from './ViewletDefineKeyBindingEvents.ts'

export const setValue = (state, value) => {
  Assert.object(state)
  Assert.string(value)
  const { $Viewlet } = state
  const $Input = $Viewlet.querySelector('input')
  $Input.value = value
}

export const focus = (state) => {
  const { $Viewlet } = state
  const $Input = $Viewlet.querySelector('input')
  $Input.focus()
}
