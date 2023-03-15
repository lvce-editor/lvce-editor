import * as InputBox from '../InputBox/InputBox.js'

export const create = (action) => {
  const { id } = action
  const $Input = InputBox.create()
  $Input.placeholder = 'Filter'
  return $Input
}
