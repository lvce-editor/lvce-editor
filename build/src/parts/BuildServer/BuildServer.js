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
import * as Tag from '../Tag/Tag.js'

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
  await Copy.copyFile({
    from: 'extensions/builtin.vscode-icons/icon-theme.json',
    to: `build/.tmp/server/server/static/${commitHash}/icon-themes/vscode-icons.json`,
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
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/fonts',
    replacement: `/${commitHash}/fonts`,
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
    replacement: `url/${commitHash}/icons/`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/css/App.css`,
    occurrence: `url(/fonts/`,
    replacement: `url(/${commitHash}/fonts/`,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `build/.tmp/server/server/static/${commitHash}/icons`,
  })
}

const getObjectDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [
    obj,
    ...Object.values(obj.dependencies).flatMap(getObjectDependencies),
  ]
}

const copySharedProcessFiles = async () => {
  await Copy.copy({
    from: 'packages/shared-process',
    to: 'build/.tmp/server/shared-process',
    ignore: ['node_modules', '.nvmrc', 'tsconfig.json', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/shared-process/LICENSE',
  })
  await Copy.copy({
    from: 'static/config',
    to: 'build/.tmp/server/shared-process/config',
  })
  await Replace.replace({
    path: 'build/.tmp/server/shared-process/src/parts/Root/Root.js',
    occurrence: `export const root = resolve(__dirname, '../../../../../')`,
    replacement: `export const root = resolve(__dirname, '../../../')`,
  })
  await Replace.replace({
    path: 'build/.tmp/server/shared-process/src/parts/Platform/Platform.js',
    occurrence: `Path.join(
      this.getAppDir(),
      'static',
      'config',
      'defaultSettings.json'
    )`,
    replacement: `Path.join(Root.root, 'config', 'defaultSettings.json')`,
  })
}

const copyServerFiles = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await Copy.copy({
    from: 'packages/server',
    to: 'build/.tmp/server/server',
    ignore: ['tsconfig.json', 'node_modules', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/server/LICENSE',
  })
  await Replace.replace({
    path: 'build/.tmp/server/server/src/server.js',
    occurrence: `const STATIC = resolve(__dirname, '../../../static')`,
    replacement: `const STATIC = resolve(__dirname, '../static')`,
  })
  await Replace.replace({
    path: 'build/.tmp/server/server/src/server.js',
    occurrence: `const ROOT = resolve(__dirname, '../../../')`,
    replacement: `const ROOT = resolve(__dirname, '../')`,
  })
  const content = `This project incorporates components from the projects listed below, that may have licenses
differing from this project:


1) License Notice for static/${commitHash}/file-icons (from https://github.com/vscode-icons/vscode-icons)
---------------------------------------

The icons are licensed under the Creative Commons - ShareAlike (CC BY-SA) license.

Branded icons are licensed under their copyright license.


2) License Notice for static/${commitHash}/icons (from https://github.com/microsoft/vscode)
---------------------------------------

MIT License

Copyright (c) 2015 - present Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


3) License Notice for static/${commitHash}/fonts/FiraCode-VariableFont.ttf (from https://github.com/tonsky/FiraCode)
---------------------------------------

Copyright (c) 2014, The Fira Code Project Authors (https://github.com/tonsky/FiraCode)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`
  await WriteFile.writeFile({
    to: 'build/.tmp/server/server/ThirdPartyNotices.txt',
    content,
  })
}

const copyExtensionHostFiles = async () => {
  await Copy.copy({
    from: 'packages/extension-host',
    to: 'build/.tmp/server/extension-host',
    ignore: [
      'tsconfig.json',
      'node_modules',
      'distmin',
      'example',
      'test',
      'package-lock.json',
    ],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/extension-host/LICENSE',
  })
}

const copyPtyHostFiles = async () => {
  await Copy.copy({
    from: 'packages/pty-host',
    to: 'build/.tmp/server/pty-host',
    ignore: [
      'tsconfig.json',
      'node_modules',
      'distmin',
      'example',
      'test',
      '.nvmrc',
      'package-lock.json',
    ],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/pty-host/LICENSE',
  })
}

const setVersions = async () => {
  const gitTag = await Tag.getGitTag()
  const files = [
    'build/.tmp/server/extension-host/package.json',
    'build/.tmp/server/pty-host/package.json',
    'build/.tmp/server/server/package.json',
    'build/.tmp/server/shared-process/package.json',
  ]
  for (const file of files) {
    const json = await JsonFile.readJson(file)
    if (json.dependencies && json.dependencies['@lvce-editor/shared-process']) {
      json.dependencies['@lvce-editor/shared-process'] = gitTag
    }
    if (json.dependencies && json.dependencies['@lvce-editor/pty-host']) {
      json.dependencies['@lvce-editor/pty-host'] = gitTag
    }
    if (json.dependencies && json.dependencies['@lvce-editor/extension-host']) {
      json.dependencies['@lvce-editor/extension-host'] = gitTag
    }
    if (json.version) {
      json.version = gitTag
    }
    await JsonFile.writeJson({
      to: file,
      value: json,
    })
  }
}

const copyRendererWorkerAndRendererProcessJs = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/server/server/static/${commitHash}/packages/renderer-process/src`,
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker/src`,
  })
}

const bundleRendererWorkerAndRendererProcessJs = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await BundleJs.bundleJs({
    cwd: Path.absolute(
      `build/.tmp/server/server/static/${commitHash}/packages/renderer-process`
    ),
    from: 'src/rendererProcessMain.js',
    platform: 'web',
    codeSplitting: true,
  })
  await BundleJs.bundleJs({
    cwd: Path.absolute(
      `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker`
    ),
    from: 'src/rendererWorkerMain.js',
    platform: 'webworker',
    codeSplitting: false,
  })
}

const applyJsOverrides = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'/${commitHash}'`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-process/src/parts/Platform/Platform.js`,
    occurrence: `PLATFORM`,
    replacement: "'remote'",
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker/src/parts/SharedProcess/SharedProcess.js`,
    occurrence: `export const platform = getPlatform() `,
    replacement: "export const platform = 'remote'",
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js`,
    occurrence: `/src/rendererWorkerMain.js`,
    replacement: '/dist/rendererWorkerMain.js',
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'/${commitHash}'`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker/src/parts/Tokenizer/Tokenizer.js`,
    occurrence: `/extensions`,
    replacement: `/${commitHash}/extensions`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker/src/parts/Platform/Platform.js`,
    occurrence: 'PLATFORM',
    replacement: `'remote'`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker/src/parts/CacheStorage/CacheStorage.js`,
    occurrence: `const CACHE_NAME = 'lvce-runtime'`,
    replacement: `const CACHE_NAME = 'lvce-runtime-${commitHash}'`,
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

  console.time('copyRendererWorkerAndRendererProcessJs')
  await copyRendererWorkerAndRendererProcessJs()
  console.timeEnd('copyRendererWorkerAndRendererProcessJs')

  console.time('applyJsOverrides')
  await applyJsOverrides()
  console.timeEnd('applyJsOverrides')

  console.time('bundleRendererWorkerAndRendererProcessJs')
  await bundleRendererWorkerAndRendererProcessJs()
  console.timeEnd('bundleRendererWorkerAndRendererProcessJs')

  console.time('copySharedProcessFiles')
  await copySharedProcessFiles()
  console.timeEnd('copySharedProcessFiles')

  console.time('copyExtensionHostFiles')
  await copyExtensionHostFiles()
  console.timeEnd('copyExtensionHostFiles')

  console.time('copyPtyHostFiles')
  await copyPtyHostFiles()
  console.timeEnd('copyPtyHostFiles')

  console.time('setVersions')
  await setVersions()
  console.timeEnd('setVersions')
}
