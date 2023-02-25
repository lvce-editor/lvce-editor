import * as IconButton from '../IconButton/IconButton.js'
import * as Assert from '../Assert/Assert.js'

export const create = (action) => {
  const { id, icon } = action
  Assert.string(id)
  Assert.string(icon)
  const $Button = IconButton.create$Button(id, icon)
  return $Button
}
