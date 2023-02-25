import * as Action from '../Action/Action.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleClick = (event) => {
  const { target } = event
  const command = target.dataset.command
  if (!command) {
    return
  }
  RendererWorker.send([command])
}

export const create = (actions) => {
  const $Actions = document.createElement('div')
  $Actions.className = 'Actions'
  $Actions.append(...actions.map(Action.create))
  $Actions.onclick = handleClick
  return $Actions
}
