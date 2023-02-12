import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 *
 * @param {string} methodName
 * @param {MouseEvent} event
 */
export const handleContextMenu = (methodName, event) => {
  event.preventDefault()
  const { clientX, clientY } = event
  RendererWorker.send(methodName, /* x */ clientX, /* y */ clientY)
}
