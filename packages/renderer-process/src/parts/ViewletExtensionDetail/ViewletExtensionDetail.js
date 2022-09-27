export const name = 'ExtensionDetail'

export const create = () => {
  const $NameText = document.createTextNode('')

  const $Name = document.createElement('div')
  $Name.className = 'ExtensionDetailName'
  $Name.append($NameText)

  const $ReadmeHtml = document.createElement('h3')
  $ReadmeHtml.className = 'Markdown'

  const $ExtensionDetailIcon = document.createElement('img')
  $ExtensionDetailIcon.className = 'ExtensionDetailIcon'

  const $ExtensionDetailHeader = document.createElement('div')
  $ExtensionDetailHeader.className = 'ExtensionDetailHeader'
  $ExtensionDetailHeader.append($ExtensionDetailIcon, $Name)

  const $ExtensionDetailMain = document.createElement('div')
  $ExtensionDetailMain.className = 'ExtensionDetailMain'
  $ExtensionDetailMain.append($ExtensionDetailHeader, $ReadmeHtml)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'ExtensionDetail'
  $Viewlet.append($ExtensionDetailMain)
  return {
    $Viewlet,
    $Name,
    $NameText,
    $ReadmeHtml,
    $ExtensionDetailIcon,
  }
}

export const setName = (state, name) => {
  const { $NameText } = state
  $NameText.nodeValue = name
}

export const setReadmeHtml = (state, sanitizedHtml) => {
  const { $ReadmeHtml } = state
  $ReadmeHtml.innerHTML = sanitizedHtml
}

export const setIconSrc = (state, src) => {
  const { $ExtensionDetailIcon } = state
  // TODO handle error and load fallback icon
  $ExtensionDetailIcon.src = src
}
