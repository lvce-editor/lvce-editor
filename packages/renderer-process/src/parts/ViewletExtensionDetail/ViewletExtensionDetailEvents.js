import * as Event from '../Event/Event.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
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
  Event.preventDefault(event)
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
