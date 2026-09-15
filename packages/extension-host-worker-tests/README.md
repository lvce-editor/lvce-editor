# End-to-end test ownership

Feature regressions belong in the repository that owns the feature. Use that repository's e2e runner and fixtures so its pull requests exercise the behavior. Keep cross-feature application integration tests here.

| Feature                                                 | Owning repository                                                               | Coverage                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Live component state and DOM inspection                 | [component-state-worker](https://github.com/lvce-editor/component-state-worker) | `packages/e2e/src/viewlet.component-state-*.ts`                                    |
| Extension filesystem saves                              | [extension-host-worker](https://github.com/lvce-editor/extension-host-worker)   | `packages/e2e/src/viewlet.main-save-extension-filesystem.ts`                       |
| Output channel selection                                | [output-view](https://github.com/lvce-editor/output-view)                       | `packages/e2e/src/viewlet.output-open-channel.ts`                                  |
| Git remote shortcut                                     | [git](https://github.com/lvce-editor/git)                                       | `packages/e2e/electron/src/git-open-remote.mjs`                                    |
| Codespaces forwarded ports                              | [codespaces](https://github.com/lvce-editor/codespaces)                         | `packages/e2e/RemoteWorkspace.spec.ts`                                             |
| Title bar menu dismissal on application blur            | [title-bar-worker](https://github.com/lvce-editor/title-bar-worker)             | `packages/e2e/application/src/viewlet.title-bar-menu-close-on-application-blur.ts` |
| Split editor sizing after hiding Explorer               | [main-area-worker](https://github.com/lvce-editor/main-area-worker)             | `packages/e2e/src/viewlet.main-area-split-hide-explorer.ts`                        |
| Bundled notebook defaults and enablement across restart | [notebook](https://github.com/lvce-editor/notebook)                             | `packages/e2e/electron/src/notebook-defaults.ts`                                   |
| Extension detail sidebar resizing                       | [extension-detail-view](https://github.com/lvce-editor/extension-detail-view)   | `packages/e2e/src/viewlet.extension-detail-sidebar-resize.ts`                      |
| Simple Browser tab dragging                             | [simple-browser-view](https://github.com/lvce-editor/simple-browser-view)       | `packages/e2e/electron/src/simple-browser.tab-reorder.ts`                          |

The Codespaces suite already verifies the forwarded port number, URL, devcontainer origin, and clearing ports on disconnect. Notebook defaults run against the packaged Electron application because the browser server does not bundle notebook. The component-state Simple Browser editing scenario retains its existing Electron-only skip in the browser suite.
