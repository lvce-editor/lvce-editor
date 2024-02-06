import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getKeyBindings = () => {
  return [
    {
      key: KeyCode.Escape,
      command: 'Viewlet.closeWidget',
      when: WhenExpression.FocusFindWidget,
      args: ['FindWidget'],
    },
    {
      key: KeyCode.Enter,
      command: 'EditorRename.finish',
      when: WhenExpression.FocusEditorRename,
    },
    {
      key: KeyCode.Escape,
      command: 'EditorRename.abort',
      when: WhenExpression.FocusEditorRename,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyB,
      command: 'Layout.toggleSideBar',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyM,
      command: 'Layout.toggleActivityBar',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Backquote,
      command: 'Layout.togglePanel',
      args: ['Terminal'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyM,
      command: 'ViewService.toggleView',
      args: ['Output'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Enter,
      command: 'Source Control.acceptInput',
      when: WhenExpression.FocusSourceControlInput,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyN,
      command: 'Explorer.newFile',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyP,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'file'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyP,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'everything'],
    },
    {
      key: KeyCode.F1,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'everything'],
    },

    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyX,
      command: 'Focus.set',
      args: ['Extensions'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyG,
      command: 'Focus.set',
      args: ['Source Control'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyE,
      command: 'Focus.set',
      args: ['Explorer'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyF,
      command: 'Focus.set',
      args: ['Search'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyY,
      command: 'Focus.set',
      args: ['Debug Console'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyM,
      command: 'Focus.set',
      args: ['Problems'],
    },

    {
      key: KeyModifier.CtrlCmd | KeyCode.Comma,
      command: 'Preferences.openSettingsJson',
    },

    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyD,
      command: 'Focus.set',
      args: ['Run and Debug'],
    },

    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyI,
      command: 'Developer.toggleDeveloperTools',
      when: WhenExpression.BrowserElectron,
    },
    {
      key: KeyCode.F6,
      command: 'Navigation.focusNextPart',
    },
    {
      key: KeyModifier.Shift | KeyCode.F6,
      command: 'Navigation.focusPreviousPart',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyG,
      command: 'QuickPick.openGoToLine',
    },

    {
      key: KeyCode.Escape,
      command: 'dialog.close',
      when: WhenExpression.FocusDialog,
    },
    {
      key: KeyCode.DownArrow,
      command: 'Menu.focusNext',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyCode.UpArrow,
      command: 'Menu.focusPrevious',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyCode.Enter,
      command: 'Menu.selectCurrent',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyCode.Space,
      command: 'Menu.selectCurrent',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyCode.Home,
      command: 'Menu.focusFirst',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyCode.End,
      command: 'Menu.focusLast',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyCode.Escape,
      command: 'Menu.hide',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyN,
      command: 'ElectronWindow.openNew',
      when: WhenExpression.BrowserElectron,
    },
    {
      key: KeyCode.Tab,
      command: 'Menu.noop',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyModifier.Shift | KeyCode.Tab,
      command: 'Menu.noop',
      when: WhenExpression.FocusMenu,
    },
    {
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyR,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'recent'],
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Digit0,
      command: 'SideBar.focus',
    },
    {
      key: KeyModifier.Shift | KeyCode.UpArrow,
      command: 'Editor.selectUp',
    },
    {
      key: KeyModifier.Shift | KeyCode.DownArrow,
      command: 'Editor.selectDown',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyF,
      command: 'Editor.openFind',
    },
    {
      key: KeyCode.Enter,
      command: 'FindWidget.focusNext',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyModifier.Shift | KeyCode.F4,
      command: 'FindWidget.focusPrevious',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyCode.F4,
      command: 'FindWidget.focusNext',
      when: WhenExpression.FocusFindWidget,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Equal,
      command: 'Window.zoomIn',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Plus,
      command: 'Window.zoomIn',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Minus,
      command: 'Window.zoomOut',
    },
    {
      key: KeyCode.Enter,
      command: 'SimpleBrowser.go',
      when: WhenExpression.FocusSimpleBrowserInput,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyR,
      command: 'Reload.reload',
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.Backslash,
      command: 'Run And Debug.togglePause',
    },
    {
      key: KeyCode.Enter,
      command: 'Run And Debug.handleEvaluate',
      when: WhenExpression.FocusDebugInput,
    },
    {
      key: KeyModifier.CtrlCmd | KeyCode.KeyJ,
      command: 'Viewlet.openWidget',
      args: ['ColorPicker'],
    },
  ]
}
