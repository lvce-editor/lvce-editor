import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleIconError = (event) => {
  RendererWorker.send('ExtensionDetail.handleIconError')
}

const isLink = ($Element) => {
  return $Element.nodeName === 'A'
}

export const handleReadmeContextMenu = (event) => {
  event.preventDefault()
  const { clientX, clientY, target } = event
  const props = Object.create(null)
  if (isLink(target)) {
    props.isLink = true
    props.url = target.href
  }
  RendererWorker.send(
    'ExtensionDetail.handleReadmeContextMenu',
    clientX,
    clientY,
    props
  )
}
