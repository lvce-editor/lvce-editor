export const create = () => {
  const $InputBox = document.createElement('div')
  $InputBox.className = 'InputBox'
  $InputBox.setAttribute('role', 'textbox')
  // $InputBox.spellcheck = false
  // $InputBox.autocapitalize = 'off'
  // $InputBox.autocomplete = 'off' // TODO needed?
  // $InputBox.type = 'text'
  // $InputBox.setAttribute('autocorrect', 'off') // for ios
  return $InputBox
}
