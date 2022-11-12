export const create = (text) => {
  const $LabelText = document.createTextNode(text)
  const $Label = document.createElement('div')
  $Label.className = 'Label'
  $Label.append($LabelText)
  return $Label
}
