export const create = () => {
  const $Element = document.createElement('div')
  $Element.textContent = '<unknown action type>'
  return $Element
}
