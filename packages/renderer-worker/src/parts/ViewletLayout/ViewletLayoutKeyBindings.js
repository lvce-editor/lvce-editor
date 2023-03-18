export const getKeyBindings = () => {
  return [
    {
      key: 'Escape',
      command: 'Viewlet.closeWidget',
      when: 'focus.FindWidget',
      args: ['FindWidget'],
    },
    {
      key: 'Enter',
      command: 'EditorRename.finish',
      when: 'focus.editorRename',
    },
    {
      key: 'Escape',
      command: 'EditorRename.abort',
      when: 'focus.editorRename',
    },

    {
      key: 'ctrl+b',
      command: 'Layout.toggleSideBar',
    },
    {
      key: 'ctrl+m',
      command: 'Layout.toggleActivityBar',
    },
    {
      key: 'ctrl+`',
      command: 'Layout.togglePanel',
      args: ['Terminal'],
    },
    {
      key: 'ctrl+shift+m',
      command: 'ViewService.toggleView',
      args: ['Output'],
    },
    {
      key: 'ctrl+Enter',
      command: 'Source Control.acceptInput',
      when: 'focus.sourceControlInput',
    },
    {
      key: 'ctrl+n',
      command: 'Explorer.newFile',
    },
    {
      key: 'ctrl+p',
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'file'],
    },
    {
      key: 'ctrl+shift+p',
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'everything'],
    },
    {
      key: 'F1',
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'everything'],
    },

    {
      key: 'ctrl+shift+x',
      command: 'Focus.set',
      args: ['Extensions'],
    },
    {
      key: 'ctrl+shift+g',
      command: 'Focus.set',
      args: ['Source Control'],
    },
    {
      key: 'ctrl+shift+e',
      command: 'Focus.set',
      args: ['Explorer'],
    },
    {
      key: 'ctrl+shift+f',
      command: 'Focus.set',
      args: ['Search'],
    },
    {
      key: 'ctrl+shift+Y',
      command: 'Focus.set',
      args: ['Debug Console'],
    },
    {
      key: 'ctrl+shift+m',
      command: 'Focus.set',
      args: ['Problems'],
    },

    {
      key: 'ctrl+,',
      command: 'Preferences.openSettingsJson',
    },

    {
      key: 'ctrl+shift+d',
      command: 'Focus.set',
      args: ['Run and Debug'],
    },

    {
      key: 'ctrl+shift+i',
      command: 'Developer.toggleDeveloperTools',
      when: 'browser.electron',
    },
    {
      key: 'F6',
      command: 'Navigation.focusNextPart',
    },
    {
      key: 'shift+F6',
      command: 'Navigation.focusPreviousPart',
    },

    {
      key: 'ctrl+g',
      command: 'QuickPick.openGoToLine',
    },
    {
      key: 'ctrl+shift+Space',
      command: 'Editor.selectInsideString',
      when: 'focus.editor',
    },

    {
      key: 'Escape',
      command: 'dialog.close',
      when: 'focus.dialog',
    },

    {
      key: 'ArrowDown',
      command: 'Menu.focusNext',
      when: 'focus.menu',
    },
    {
      key: 'ArrowUp',
      command: 'Menu.focusPrevious',
      when: 'focus.menu',
    },
    {
      key: 'Enter',
      command: 'Menu.selectCurrent',
      when: 'focus.menu',
    },
    {
      key: 'Space',
      command: 'Menu.selectCurrent',
      when: 'focus.menu',
    },
    {
      key: 'Home',
      command: 'Menu.focusFirst',
      when: 'focus.menu',
    },
    {
      key: 'End',
      command: 'Menu.focusLast',
      when: 'focus.menu',
    },
    {
      key: 'Escape',
      command: 'Menu.hide',
      when: 'focus.menu',
    },
    {
      key: 'ctrl+shift+n',
      command: 'Workbench.newWindow',
      when: 'browser.electron',
    },
    {
      key: 'Tab',
      command: 'Menu.noop',
      when: 'focus.menu',
    },
    {
      key: 'Shift+Tab',
      command: 'Menu.noop',
      when: 'focus.menu',
    },
    {
      key: 'ctrl+shift+r',
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'recent'],
    },

    {
      key: 'ctrl+0',
      command: 'SideBar.focus',
    },

    {
      key: 'shift+ArrowUp',
      command: 'Editor.selectUp',
    },
    {
      key: 'shift+ArrowDown',
      command: 'Editor.selectDown',
    },
    {
      key: 'ctrl+f',
      command: 'Editor.openFind',
    },
    {
      key: 'Enter',
      command: 'FindWidget.focusNext',
      when: 'focus.FindWidget',
    },
    {
      key: 'shift+F4',
      command: 'FindWidget.focusPrevious',
      when: 'focus.FindWidget',
    },
    {
      key: 'F4',
      command: 'FindWidget.focusNext',
      when: 'focus.FindWidget',
    },
    {
      key: 'ctrl+=',
      command: 'Window.zoomIn',
    },
    {
      key: 'ctrl++',
      command: 'Window.zoomIn',
    },
    {
      key: 'ctrl+-',
      command: 'Window.zoomOut',
    },

    {
      key: 'Enter',
      command: 'SimpleBrowser.go',
      when: 'focus.SimpleBrowserInput',
    },
    {
      key: 'ctrl+r',
      command: 'Window.reload',
    },
    {
      key: 'ctrl+\\',
      command: 'Run And Debug.togglePause',
    },
    {
      key: 'Enter',
      command: 'Run And Debug.handleEvaluate',
      when: 'focus.DebugInput',
    },
    {
      key: 'ctrl+j',
      command: 'Viewlet.openWidget',
      args: ['ColorPicker'],
    },
  ]
}
