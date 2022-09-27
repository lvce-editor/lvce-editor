export const name = 'ExtensionDetail'

export const create = () => {
  const $NameText = document.createTextNode('')

  const $Name = document.createElement('h1')
  $Name.append($NameText)

  const $ReadmeHtml = document.createElement('div')
  $ReadmeHtml.className = 'Markdown'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'ExtensionDetail'
  $Viewlet.append($Name, $ReadmeHtml)
  return {
    $Viewlet,
    $Name,
    $NameText,
    $ReadmeHtml,
  }
}

export const setName = (state, name) => {
  const { $NameText } = state
  $NameText.nodeValue = name
}

// TODO sanitize html
export const setReadmeHtml = (state, html) => {
  const { $ReadmeHtml } = state
  $ReadmeHtml.innerHTML = html
}
