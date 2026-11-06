import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({ invoke: jest.fn(async () => {}) }))

const ApplicationRegistry = await import('../src/parts/ApplicationRegistry/ApplicationRegistry.ts')
const Command = await import('../src/parts/Command/Command.js')
const ExtensionViewContext = await import('../src/parts/ExtensionViewContext/ExtensionViewContext.js')
const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')
const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.js')

for (const applicationId of ['chat-window', undefined]) {
  test(`dispatches a focused extension shortcut to ${applicationId || 'the legacy runtime'}`, async () => {
    const scoped = jest.fn(async () => {})
    const global = jest.fn(async () => {})
    Command.register('Application.execute', scoped)
    Command.register('ExtensionHost.executeCommand', global)
    if (applicationId) {
      ApplicationRegistry.create({ href: 'lvce://-/', id: applicationId, layoutUid: 8101, workspacePath: '', workspaceUri: '' })
      ApplicationRegistry.own(applicationId, 8102)
    }
    try {
      ExtensionViewContext.handleViewContextChange(8102, 'chat2.views.chat', { 'chat2.composerFocus': true })
      KeyBindingsState.state.matchingKeyBindings = [
        { args: ['chat2.submit'], command: 'ExtensionHost.executeCommand', key: 1, when: 'chat2.composerFocus' },
      ]
      await KeyBindings.handleKeyBinding(1)
      if (applicationId) {
        expect(scoped).toHaveBeenCalledWith(applicationId, 'ExtensionHost.executeCommand', 'chat2.submit')
        expect(global).not.toHaveBeenCalled()
      } else {
        expect(global).toHaveBeenCalledWith('chat2.submit')
        expect(scoped).not.toHaveBeenCalled()
      }
    } finally {
      ExtensionViewContext.handleViewContextChange(8102, 'chat2.views.chat', {})
      if (applicationId) await ApplicationRegistry.remove(applicationId)
    }
  })
}
