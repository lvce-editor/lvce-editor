import * as KeyCode from '../KeyCode/KeyCode.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.LeftArrow,
      command: 'EditorImage.moveLeft',
      when: 'focus.EditorImage',
    },
    {
      key: KeyCode.RightArrow,
      command: 'EditorImage.moveRight',
      when: 'focus.EditorImage',
    },
    {
      key: KeyCode.UpArrow,
      command: 'EditorImage.moveUp',
      when: 'focus.EditorImage',
    },
    {
      key: KeyCode.DownArrow,
      command: 'EditorImage.moveDown',
      when: 'focus.EditorImage',
    },
  ]
}
