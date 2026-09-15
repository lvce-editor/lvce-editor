# Simple Browser workflows

Define ordered tasks in `settings.json`:

```json
{
  "simpleBrowser.workflows": [
    {
      "id": "play-soundcloud-music",
      "tasks": [
        { "type": "open-simple-browser-tab", "url": "https://soundcloud.com" },
        { "type": "press-key", "key": "space" },
        { "type": "press-key", "key": "shift+L" }
      ]
    }
  ]
}
```

Invoke a workflow using a `keybindings.json` entry:

```json
[
  {
    "key": "ctrl+shift+s",
    "command": "SimpleBrowser.executeWorkflow",
    "args": ["play-soundcloud-music"]
  }
]
```

Workflows run in Electron. Each workflow starts by opening an HTTP(S) page in Simple Browser and waits for its page-load completion before sending native keys. URLs without a scheme use HTTPS. Additional open tasks change the workflow's target to the newly opened page.

Supported keys include letters, digits, Space, Enter, Tab, Escape, Backspace, Delete, arrows, Home, End, PageUp, PageDown, and F1–F24. Combine keys with ctrl, shift, alt, or meta (cmd). Only one workflow runs at a time. Invalid tasks are rejected before opening a page; navigation errors and closing or switching the target tab stop execution.

Page-load completion does not guarantee that a site's asynchronously loaded controls are ready. Login, consent dialogs, and website-specific shortcuts still apply.
