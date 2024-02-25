import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as GetEditorSourceActions from '../GetEditorSourceActions/GetEditorSourceActions.js'
import * as Focus from '../Focus/Focus.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    id,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    maxHeight: 0,
    sourceActions: [],
  }
}

export const loadContent = async (state, savedState, position) => {
  const editor = GetActiveEditor.getActiveEditor()
  // TODO request source actions information from extensions
  const sourceActions = await GetEditorSourceActions.getEditorSourceActions()
  return {
    ...state,
    sourceActions,
    x: 200,
    y: -200,
    width: 250,
    height: 150,
    maxHeight: 150,
  }
}

export const handleFocus = () => {
  Focus.setFocus(WhenExpression.FocusSourceActions)
}
