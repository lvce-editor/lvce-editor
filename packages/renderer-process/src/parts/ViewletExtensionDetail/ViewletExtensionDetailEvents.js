import * as ViewletExtensionDetailFunctions from './ViewletExtensionDetailFunctions.js'

export const handleIconError = (event) => {
  ViewletExtensionDetailFunctions.handleIconError()
}

const isLink = ($Element) => {
  return $Element.nodeName === 'A'
}

const isImage = ($Element) => {
  return $Element.nodeName === 'IMG'
}

export const handleReadmeContextMenu = (event) => {
  event.preventDefault()
  const { clientX, clientY, target } = event
  const props = Object.create(null)
  if (isLink(target)) {
    props.isLink = true
    props.url = target.href
  } else if (isImage(target)) {
    props.isImage = true
    props.url = target.src
  }
  ViewletExtensionDetailFunctions.handleReadmeContextMenu(clientX, clientY, props)
}
