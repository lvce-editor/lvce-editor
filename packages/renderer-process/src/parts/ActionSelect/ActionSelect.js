export const create = ({ options }) => {
  const $Select = document.createElement('select')
  $Select.className = 'Select'
  for (const option of options) {
    const $Option = document.createElement('option')
    $Option.textContent = option
    $Select.append($Option)
  }
  const $SelectIcon = document.createElement('div')
  $SelectIcon.className = 'SelectIcon'
  // TODO figure out if it is possible to get rid of select wrapper element
  const $SelectWrapper = document.createElement('div')
  $SelectWrapper.className = 'SelectWrapper'
  $SelectWrapper.append($Select, $SelectIcon)
  return $SelectWrapper
}
