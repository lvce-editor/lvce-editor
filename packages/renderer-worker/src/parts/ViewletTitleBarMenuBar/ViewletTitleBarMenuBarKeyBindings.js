export const getKeyBindings = () => {
  return [
    {
      key: 'ArrowDown',
      command: 'TitleBarMenuBar.handleKeyArrowDown',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'ArrowUp',
      command: 'TitleBarMenuBar.handleKeyArrowUp',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'ArrowRight',
      command: 'TitleBarMenuBar.handleKeyArrowRight',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'ArrowLeft',
      command: 'TitleBarMenuBar.handleKeyArrowLeft',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'Space',
      command: 'TitleBarMenuBar.handleKeySpace',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'Home',
      command: 'TitleBarMenuBar.handleKeyHome',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'End',
      command: 'TitleBarMenuBar.handleKeyEnd',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: 'Escape',
      command: 'TitleBarMenuBar.handleKeyEscape',
      when: 'focus.TitleBarMenuBar',
    },
  ]
}
