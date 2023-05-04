import { div, img, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getExtensionVirtualDom = (extension) => {
  console.log({ extension })
  return [
    div(
      {
        role: 'listitem',
        ariaRoleDescription: 'Extension',
        className: 'ExtensionListItem',
        ariaPosInset: extension.posInSet,
        ariaSetSize: extension.setSize,
        top: extension.top,
      },
      2
    ),
    img(),
    // text('hello world'),
  ]
}

export const getExtensionsVirtualDom = (visibleExtensions) => {
  const dom = []
  for (const extension of visibleExtensions) {
    dom.push(...getExtensionVirtualDom(extension))
  }
  return dom
}
