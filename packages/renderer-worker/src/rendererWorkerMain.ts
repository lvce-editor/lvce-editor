import * as InitData from './parts/InitData/InitData.js'
import * as RendererProcess from './parts/RendererProcess/RendererProcess.js'
import * as RuntimeConfig from './parts/RuntimeConfig/RuntimeConfig.ts'
import * as CommandMapRef from './parts/CommandMapRef/CommandMapRef.js'
import * as CommandMap from './parts/CommandMap/CommandMap.js'
import * as Command from './parts/Command/Command.js'
import * as Module from './parts/Module/Module.js'

Object.assign(CommandMapRef.commandMapRef, CommandMap.commandMap)
Command.setLoad(Module.load)

const stage = (name: string) => console.error(`[renderer-worker startup] ${name}`)

const main = async () => {
  stage('listen:start')
  await RendererProcess.listen()
  stage('listen:done')
  const initData = await InitData.getInitData()
  stage('init-data:done')
  RuntimeConfig.initialize(initData.Config)
  stage('runtime-config:done')

  const [Workbench, Platform, AssetDir] = await Promise.all([
    import('./parts/Workbench/Workbench.js'),
    import('./parts/Platform/Platform.js'),
    import('./parts/AssetDir/AssetDir.js'),
  ])
  stage('imports:done')
  await Workbench.startup(initData, Platform.getPlatform(), AssetDir.assetDir)
  stage('workbench:done')
}

await main().catch((error) => {
  console.error('[renderer-worker startup] failed', error)
  throw error
})
