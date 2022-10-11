export const name = 'SimpleBrowser'

export const create = () => {
  const $Iframe = document.createElement('iframe')
  $Iframe.className = 'SimpleBrowserIframe'
  $Iframe.setAttribute('crossorigin', 'anonymous')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'SimpleBrowser'
  $Viewlet.append($Iframe)
  return {
    $Iframe,
    $Viewlet: $Viewlet,
  }
}

export const setIframeSrc = (state, iframeSrc) => {
  const { $Iframe } = state
  $Iframe.src = iframeSrc
}

export const dispose = (state) => {}
