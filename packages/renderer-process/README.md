# renderer-process

The `renderer-process` runs in the browser and used for the user interface.

- `renderer-process` is loaded by `index.html` via a script tag.
- `renderer-process` creates the `render-worker`
- `renderer-process` sends events to the `renderer-worker`
- `renderer-process` executes commands from `renderer-worker`

## Commands

| Module        | Id     | Name                         | Parameters                                  |
| ------------- | ------ | ---------------------------- | ------------------------------------------- |
| ACTIVITY_BAR  | 7771   |                              |                                             |
| ACTIVITY_BAR  | 717112 |                              |                                             |
| ACTIVITY_BAR  | 717113 | ActivityBar.hydrate          | callbackId                                  |
| ACTIVITY_BAR  | 717114 | ActivityBar.setItems         | activityBarItemsTop, activityBarItemsBottom |
| ACTIVITY_BAR  | 717115 | ActivityBar.focus            | -                                           |
| ACTIVITY_BAR  | 717116 |                              |                                             |
| ACTIVITY_BAR  | 717117 |                              |                                             |
| ACTIVITY_BAR  | 717118 |                              |                                             |
| ACTIVITY_BAR  | 717119 |                              |                                             |
| ACTIVITY_BAR  | 717120 | ActivityBar.focusIndex       | group, index                                |
| ACTIVITY_BAR  | 717121 | ActivityBar.setBadgeCount    | index, count                                |
| CONTEXT_MENU  | 661    | ContextMenu.show             | x, y, items                                 |
| CONTEXT_MENU  | 662    | ContextMenu.close            | -                                           |
| CONTEXT_MENU  | 663    | ContextMenu.focusIndex       | index                                       |
| CONTEXT_MENU  | 664    |                              |                                             |
| CONTEXT_MENU  | 665    |                              |                                             |
| CONTEXT_MENU  | 666    |                              |                                             |
| LAYOUT        | 1100   | Layout.showSideBar           | -                                           |
| LAYOUT        | 1101   | Layout.hideSideBar           | -                                           |
| LAYOUT        | 1102   | Layout.toggleSideBar         | -                                           |
| LAYOUT        | 1103   | Layout.showPanel             | -                                           |
| LAYOUT        | 1104   | Layout.hidePanel             | -                                           |
| LAYOUT        | 1105   | Layout.togglePanel           | -                                           |
| LAYOUT        | 1106   | Layout.showActivityBar       | -                                           |
| LAYOUT        | 1107   | Layout.hideActivityBar       | -                                           |
| LAYOUT        | 1108   | Layout.toggleActivityBar     | -                                           |
| LAYOUT        | 2222   |                              |                                             |
| LAYOUT        | 2223   |                              |                                             |
| NOTIFICATIONS | 991    | Notification.create          | type, message                               |
| NOTIFICATIONS | 992    | Notification.dispose         | id                                          |
| QUICK_PICK    | 81178  | QuickPick.hide               | -                                           |
| QUICK_PICK    | 81179  | QuickPick.show               | value, recentPicks, picks                   |
| QUICK_PICK    | 18920  | QuickPick.focusIndex         | index                                       |
| QUICK_PICK    | 18921  |                              |                                             |
| QUICK_PICK    | 18922  |                              |                                             |
| QUICK_PICK    | 18923  |                              |                                             |
| QUICK_PICK    | 18924  | QuickPick.selectCurrentIndex | -                                           |
| QUICK_PICK    | 18930  |                              |                                             |
| QUICK_PICK    | 18931  | QuickPick.setValue           | value                                       |
| QUICK_PICK    | 18932  | QuickPick.updatePicks        | recentPicks, picks                          |
| SIDE_BAR      | 5551   | SideBar.hydrate              | callbackId                                  |
| SIDE_BAR      | 5552   | SideBar.openViewlet          | id                                          |
| SIDE_BAR      | 5553   | SideBar.getCachedViewlet     | callbackId                                  |
| WINDOW        | 8080   | Window.reload                | -                                           |
| WINDOW        | 8081   | Window.minimize              | -                                           |
| WINDOW        | 8082   | Window.maximize              | -                                           |
| WINDOW        | 8083   | Window.unmaximize            | -                                           |
| WINDOW        | 8084   | Window.close                 | -                                           |
| WINDOW        | 8085   |                              |                                             |
