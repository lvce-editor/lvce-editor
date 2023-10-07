export const create = () => {
  const $TextArea = document.createElement('textarea')
  $TextArea.className = 'MultilineInputBox'
  $TextArea.spellcheck = false
  $TextArea.autocapitalize = 'off'
  $TextArea.setAttribute('autocorrect', 'off') // for ios
  return $TextArea
}
