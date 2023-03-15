export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowLeft',
      command: 'EditorImage.moveLeft',
      when: 'focus.EditorImage',
    },
    {
      key: 'ArrowRight',
      command: 'EditorImage.moveRight',
      when: 'focus.EditorImage',
    },
    {
      key: 'ArrowUp',
      command: 'EditorImage.moveUp',
      when: 'focus.EditorImage',
    },
    {
      key: 'ArrowDown',
      command: 'EditorImage.moveDown',
      when: 'focus.EditorImage',
    },
  ]
}
