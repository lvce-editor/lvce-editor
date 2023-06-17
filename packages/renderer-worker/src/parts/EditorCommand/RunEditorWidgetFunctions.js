import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const runEditorWidgetFunctions = (editor, fnName, ...args) => {
  const allCommands = []
  const { widgets } = editor
  if (widgets) {
    for (const widget of widgets) {
      const instance = ViewletStates.getInstance(widget)
      if (!instance) {
        return []
      }
      const { state, factory } = instance
      const newState = factory[fnName](state, editor, ...args)
      if (newState.disposed) {
        const index = editor.widgets.indexOf(widget)
        editor.widgets.splice(index, 1)
        allCommands.push(...Viewlet.disposeFunctional(widget))
      } else {
        allCommands.push(...Viewlet.setStateFunctional(widget, newState))
      }
    }
  }
  return allCommands
}
