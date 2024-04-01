export const create = () => {
  const $InputBox = document.createElement('input')
  $InputBox.className = 'InputBox'
  $InputBox.spellcheck = false
  $InputBox.autocapitalize = 'off'
  // $InputBox.autocomplete = 'off' // TODO needed?
  $InputBox.type = 'text'
  $InputBox.setAttribute('autocorrect', 'off') // for ios
  return $InputBox
}
