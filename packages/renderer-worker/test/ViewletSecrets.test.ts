import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SecretsViewWorker/SecretsViewWorker.ts', () => ({
  invoke: jest.fn(async (command) => {
    if (command === 'SecretsView.diff2' || command === 'SecretsView.render2') {
      return []
    }
    if (command === 'SecretsView.getCommandIds') {
      return ['edit', 'save']
    }
    return undefined
  }),
}))

const SecretsViewWorker = await import('../src/parts/SecretsViewWorker/SecretsViewWorker.ts')
const ViewletSecrets = await import('../src/parts/ViewletSecrets/ViewletSecrets.ipc.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('provides the view name, title, and styles', () => {
  const state = ViewletSecrets.create(1, 'secrets://', 10, 20, 800, 600)

  expect(ViewletSecrets.name).toBe('Secrets')
  expect(ViewletSecrets.getTitle()).toBe('Secrets')
  expect(ViewletSecrets.renderTitle.apply(state, state)).toBe('Secrets')
  expect(ViewletSecrets.Css).toContain('/css/parts/ViewletSecrets.css')
})

test('loads content from the secrets worker', async () => {
  const state = ViewletSecrets.create(1, 'secrets://', 10, 20, 800, 600)

  await ViewletSecrets.loadContent(state)

  expect(SecretsViewWorker.invoke).toHaveBeenNthCalledWith(1, 'SecretsView.create', 1, 'secrets://', 10, 20, 800, 600)
  expect(SecretsViewWorker.invoke).toHaveBeenNthCalledWith(2, 'SecretsView.loadContent', 1)
  expect(SecretsViewWorker.invoke).toHaveBeenNthCalledWith(3, 'SecretsView.diff2', 1)
  expect(SecretsViewWorker.invoke).toHaveBeenNthCalledWith(4, 'SecretsView.render2', 1, [])
})

test('registers secrets view commands', async () => {
  await ViewletSecrets.getCommands()

  expect(typeof ViewletSecrets.Commands.edit).toBe('function')
  expect(typeof ViewletSecrets.Commands.save).toBe('function')
})
