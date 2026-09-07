import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({ invoke: jest.fn() }))
const MainProcess = await import('../src/parts/MainProcess/MainProcess.ts')
const ContextMenu = await import('../src/parts/ElectronContextMenu/ElectronContextMenu.ts')
const Module = await import('../src/parts/Module/Module.ts')
const ModuleMap = await import('../src/parts/ModuleMap/ModuleMap.ts')

test('copy image keeps the original contents and page coordinates', async () => {
  await ContextMenu.copyImage(42, 20, 30)
  expect(MainProcess.invoke).toHaveBeenCalledWith('ElectronWebContents.callFunction', 42, 'copyImageAt', 20, 30)
})

test('native clipboard command can be loaded and copies captured text', async () => {
  const module = await Module.load(ModuleMap.getModuleId('ElectronClipBoard.writeText'))
  await module.Commands.writeText('selected text')
  expect(MainProcess.invoke).toHaveBeenCalledWith('ElectronClipBoard.writeText', 'selected text')
})
