import * as Action from '../Action/Action.js'

export const create = (actions) => {
  const $Actions = document.createElement('div')
  $Actions.className = 'Actions'
  $Actions.append(...actions.map(Action.create))
  return $Actions
}
