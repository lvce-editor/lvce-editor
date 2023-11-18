import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.DownArrow,
      command: 'TitleBarMenuBar.handleKeyArrowDown',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.UpArrow,
      command: 'TitleBarMenuBar.handleKeyArrowUp',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.RightArrow,
      command: 'TitleBarMenuBar.handleKeyArrowRight',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.LeftArrow,
      command: 'TitleBarMenuBar.handleKeyArrowLeft',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.Space,
      command: 'TitleBarMenuBar.handleKeySpace',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.Home,
      command: 'TitleBarMenuBar.handleKeyHome',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.End,
      command: 'TitleBarMenuBar.handleKeyEnd',
      when: 'focus.TitleBarMenuBar',
    },
    {
      key: KeyCode.Escape,
      command: 'TitleBarMenuBar.handleKeyEscape',
      when: 'focus.TitleBarMenuBar',
    },
  ]
}
