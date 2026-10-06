import * as InitData from './parts/InitData/InitData.js'
import * as RendererProcess from './parts/RendererProcess/RendererProcess.js'
import * as RuntimeConfig from './parts/RuntimeConfig/RuntimeConfig.ts'
import * as CommandMapRef from './parts/CommandMapRef/CommandMapRef.js'
import * as CommandMap from './parts/CommandMap/CommandMap.js'
import * as Command from './parts/Command/Command.js'
import * as Module from './parts/Module/Module.js'

Object.assign(CommandMapRef.commandMapRef, CommandMap.commandMap)
Command.setLoad(Module.load)

const main = async () => {
  console.warn('renderer startup: listen')
  await RendererProcess.listen()
  console.warn('renderer startup: listening')
  const initData = await InitData.getInitData()
  console.warn('renderer startup: init data', JSON.stringify(initData.Config))
  RuntimeConfig.initialize(initData.Config)

  const [Workbench, Platform, AssetDir] = await Promise.all([
    import('./parts/Workbench/Workbench.js'),
    import('./parts/Platform/Platform.js'),
    import('./parts/AssetDir/AssetDir.js'),
  ])
  console.warn('renderer startup: workbench')
  await Workbench.startup(initData, Platform.getPlatform(), AssetDir.assetDir)
  console.warn('renderer startup: complete')
}

// Let inlined dynamic-import modules finish initializing before startup uses them.
queueMicrotask(() => {
  void main()
})
