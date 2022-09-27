export const name = 'ExtensionDetail'

export const create = () => {
  const $NameText = document.createTextNode('')

  const $Name = document.createElement('h1')
  $Name.append($NameText)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'ExtensionDetail'
  $Viewlet.append($Name)
  return {
    $Viewlet,
    $Name,
    $NameText,
  }
}

export const setName = (state, name) => {
  const { $NameText } = state
  $NameText.nodeValue = name
}
