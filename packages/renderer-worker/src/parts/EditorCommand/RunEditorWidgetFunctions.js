// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const runEditorWidgetFunctions = async (editor, fnName, ...args) => {
  if (editor.widgets) {
    for (const widget of editor.widgets) {
      const instance = ViewletStates.getInstance(widget)
      if (!instance) {
        return
      }
      const { state, factory } = instance
      const newState = factory[fnName](state, editor, ...args)
      if (newState.disposed) {
        await Viewlet.dispose(widget)
      } else {
        await Viewlet.setState(widget, newState)
      }
    }
  }
}
