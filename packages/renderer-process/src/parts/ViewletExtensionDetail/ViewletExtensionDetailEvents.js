import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleIconError = (event) => {
  RendererWorker.send('ExtensionDetail.handleIconError')
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
  RendererWorker.send(
    'ExtensionDetail.handleReadmeContextMenu',
    clientX,
    clientY,
    props
  )
}
