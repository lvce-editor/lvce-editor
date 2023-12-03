import * as KeyCode from '../KeyCode/KeyCode.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.LeftArrow,
      command: 'EditorImage.moveLeft',
      when: WhenExpression.FocusEditorImage,
    },
    {
      key: KeyCode.RightArrow,
      command: 'EditorImage.moveRight',
      when: WhenExpression.FocusEditorImage,
    },
    {
      key: KeyCode.UpArrow,
      command: 'EditorImage.moveUp',
      when: WhenExpression.FocusEditorImage,
    },
    {
      key: KeyCode.DownArrow,
      command: 'EditorImage.moveDown',
      when: WhenExpression.FocusEditorImage,
    },
  ]
}
