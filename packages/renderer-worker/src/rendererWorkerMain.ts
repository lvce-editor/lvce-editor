import * as InitData from './parts/InitData/InitData.js'
import * as RendererProcess from './parts/RendererProcess/RendererProcess.js'
import * as RuntimeConfig from './parts/RuntimeConfig/RuntimeConfig.ts'
import * as CommandMapRef from './parts/CommandMapRef/CommandMapRef.js'
import * as CommandMap from './parts/CommandMap/CommandMap.js'

Object.assign(CommandMapRef.commandMapRef, CommandMap.commandMap)

const main = async () => {
  await RendererProcess.listen()
  const initData = await InitData.getInitData()
  RuntimeConfig.initialize(initData.Config)

  const [Workbench, Platform, AssetDir] = await Promise.all([
    import('./parts/Workbench/Workbench.js'),
    import('./parts/Platform/Platform.js'),
    import('./parts/AssetDir/AssetDir.js'),
  ])
  await Workbench.startup(initData, Platform.getPlatform(), AssetDir.assetDir)
}

await main()
