import { readdir, readFile } from 'fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Clean from '../Clean/Clean.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Remove from '../Remove/Remove.js'
import * as Exec from '../Exec/Exec.js'
import * as Root from '../Root/Root.js'

const copyStaticFiles = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await Copy.copy({
    from: 'static/config',
    to: `build/.tmp/server/server/static/${commitHash}/config`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `build/.tmp/server/server/static/${commitHash}/static/js`,
  })
  await Copy.copyFile({
    from: 'static/favicon.ico',
    to: `build/.tmp/server/server/static/favicon.ico`,
  })
  await Copy.copyFile({
    from: 'static/serviceWorker.js',
    to: `build/.tmp/server/server/static/serviceWorker.js`,
  })
  await Copy.copy({
    from: 'static/fonts',
    to: `build/.tmp/server/server/static/${commitHash}/fonts`,
  })
  await Copy.copy({
    from: 'static/images',
    to: `build/.tmp/server/server/static/images`,
  })
  await Copy.copy({
    from: 'static/sounds',
    to: `build/.tmp/server/server/static/${commitHash}/sounds`,
  })
  await Copy.copyFile({
    from: 'static/manifest.json',
    to: `build/.tmp/server/server/static/manifest.json`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/manifest.json`,
    occurrence: '/icons',
    replacement: `/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/serviceWorker.js`,
    occurrence: `const CACHE_STATIC_NAME = 'static-v4'`,
    replacement: `const CACHE_STATIC_NAME = 'static-${commitHash}'`,
  })
  await Copy.copyFile({
    from: 'static/index.html',
    to: `build/.tmp/server/server/static/index.html`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/config',
    replacement: `/${commitHash}/config`,
  })

  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '</head>',
    replacement: `  <link rel="preload" href="/${commitHash}/config/defaultSettings.json" as="fetch" crossorigin>
    <link rel="preload" href="/${commitHash}/config/languages.json" as="fetch" crossorigin>
    <link rel="preload" href="/${commitHash}/themes/slime.json" as="fetch" crossorigin>
    <link rel="preload" href="/${commitHash}/icon-themes/vscode-icons.json" as="fetch" crossorigin>
  </head>`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '</body>',
    replacement: `  <script>
// set background colors to avoid white flash on firefox
const px = value => {
  return \`\${value}px\`
}

const getLayout = () => {
  const layoutItem = localStorage.getItem('layout')
  if(!layoutItem){
    return undefined
  }
  try {
    return JSON.parse(layoutItem)
  } catch {
    return undefined
  }
}

const preload = () => {
  const layout = getLayout()
  if(!layout){
    return
  }

  const $ActivityBar = document.createElement('div')
  $ActivityBar.style.left = px(layout.activityBarLeft)
  $ActivityBar.style.top = px(layout.activityBarTop)
  $ActivityBar.style.width = px(layout.activityBarWidth)
  $ActivityBar.style.height = px(layout.activityBarHeight)
  $ActivityBar.style.background = 'rgb(41, 48, 48)'
  $ActivityBar.style.position = 'fixed'

  const $Main = document.createElement('div')
  $Main.style.left = px(layout.mainLeft)
  $Main.style.top = px(layout.mainTop)
  $Main.style.width = px(layout.mainWidth)
  $Main.style.height = px(layout.mainHeight)
  $Main.style.background = '#1e2324'
  $Main.style.position = 'fixed'

  const $TitleBar = document.createElement('div')
  $TitleBar.style.top = px(layout.titleBarTop)
  $TitleBar.style.left = px(layout.titleBarLeft)
  $TitleBar.style.width = px(layout.titleBarWidth)
  $TitleBar.style.height = px(layout.titleBarHeight)
  $TitleBar.style.background = 'rgb(40, 46, 47)'
  $TitleBar.style.position = 'fixed'

  const $StatusBar = document.createElement('div')
  $StatusBar.style.top = px(layout.statusBarTop)
  $StatusBar.style.left = px(layout.statusBarLeft)
  $StatusBar.style.width = px(layout.statusBarWidth)
  $StatusBar.style.height = px(layout.statusBarHeight)
  $StatusBar.style.background = 'black'
  $StatusBar.style.position = 'fixed'

  const $SideBar = document.createElement('div')
  $SideBar.style.top = px(layout.sideBarTop)
  $SideBar.style.left = px(layout.sideBarLeft)
  $SideBar.style.width = px(layout.sideBarWidth)
  $SideBar.style.height = px(layout.sideBarHeight)
  $SideBar.style.background = '#1b2020'
  $SideBar.style.position = 'fixed'

  const $Preload = document.createElement('div')
  $Preload.style.position = 'fixed'
  $Preload.style.zIndex=1
  $Preload.append($TitleBar, $Main, $SideBar, $ActivityBar, $StatusBar)

  document.body.append($Preload)

  window.addEventListener('load', () => {
    requestIdleCallback(()=>{
      $Preload.remove()
    })
  })
}

preload()
    </script>
  </body>`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/packages/renderer-process/src/rendererProcessMain.js',
    replacement: `/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/packages/renderer-worker/src/rendererWorkerMain.js',
    replacement: `/${commitHash}/packages/renderer-worker/dist/rendererWorkerMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/icons',
    replacement: `/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/css',
    replacement: `/${commitHash}/css`,
  })
  await Copy.copy({
    from: 'extensions/builtin.vscode-icons/icons',
    to: `build/.tmp/server/server/static/${commitHash}/file-icons`,
  })
  await BundleCss.bundleCss({
    to: `build/.tmp/server/server/static/${commitHash}/css/App.css`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/css/App.css`,
    occurrence: `url(/icons/`,
    replacement: `url(/${commitHash}/${commitHash}/icons/`,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `build/.tmp/server/server/static/${commitHash}/icons`,
  })
}

const copyRendererProcess = async () => {}

const copyRendererWorker = async () => {}

const copyServer = async () => {}

const getObjectDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [
    obj,
    ...Object.values(obj.dependencies).flatMap(getObjectDependencies),
  ]
}

const getNodeModuleDependencies = async (root) => {
  const { stdout } = await Exec.exec(
    'npm',
    ['list', '--omit=dev', '--parseable', '--all'],
    {
      cwd: root,
    }
  )
  const lines = stdout.split('\n')
  return lines.slice(1, -1)
}

const copySharedProcessFiles = async () => {
  await Copy.copy({
    from: 'packages/shared-process',
    to: 'build/.tmp/server/shared-process',
    ignore: ['node_modules', '.nvmrc', 'tsconfig.json'],
  })
}

const copyServerFiles = async () => {
  await Copy.copy({
    from: 'packages/server',
    to: 'build/.tmp/server/server',
    ignore: ['tsconfig.json'],
  })
}

const copyExtensionHostFiles = async () => {
  await Copy.copy({
    from: 'packages/extension-host',
    to: 'build/.tmp/server/extension-host',
    ignore: ['tsconfig.json', 'node_modules', 'distmin', 'example', 'test'],
  })
}

export const build = async () => {
  Console.time('clean')
  await Remove.remove('build/.tmp/server')
  Console.timeEnd('clean')

  console.time('copyServerFiles')
  await copyServerFiles()
  console.timeEnd('copyServerFiles')

  console.time('copyStaticFiles')
  await copyStaticFiles()
  console.timeEnd('copyStaticFiles')

  console.time('copyRendererProcess')
  await copyRendererProcess()
  console.timeEnd('copyRendererProcess')

  console.time('copyRendererWorker')
  await copyRendererWorker()
  console.timeEnd('copyRendererWorker')

  console.time('copySharedProcessFiles')
  await copySharedProcessFiles()
  console.timeEnd('copySharedProcessFiles')

  console.time('copyExtensionHostFiles')
  await copyExtensionHostFiles()
  console.timeEnd('copyExtensionHostFiles')

  console.time('copyServer')
  await copyServer()
  console.timeEnd('copyServer')
}
