// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const runEditorWidgetFunctions = async (editor, fnName, ...args) => {
  if (editor.widgets) {
    for (const widget of editor.widgets) {
      const instance = ViewletStates.getInstance(widget)
      const { state, factory } = instance
      const newState = factory[fnName](state, editor, ...args)
      console.log({ newState })
      await Viewlet.setState(widget, newState)
    }
    console.log('update completion list')
  }
}
