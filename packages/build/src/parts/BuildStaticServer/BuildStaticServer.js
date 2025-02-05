import { readdir } from 'fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleWorkers from '../BundleWorkers/BundleWorkers.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as GetStaticFiles from '../GetStaticFiles/GetStaticFiles.js'

const copyStaticFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: 'static/config',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/config`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/js`,
  })
  await Copy.copy({
    from: 'static/lib-css',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/lib-css`,
  })
  await Copy.copyFile({
    from: 'static/favicon.ico',
    to: `packages/build/.tmp/server/static-server/static/favicon.ico`,
  })
  await Copy.copy({
    from: 'static/fonts',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/fonts`,
  })
  await Copy.copy({
    from: 'static/images',
    to: `packages/build/.tmp/server/static-server/static/images`,
  })
  await Copy.copy({
    from: 'static/sounds',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/sounds`,
  })
  await Copy.copyFile({
    from: 'static/manifest.json',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/manifest.json`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/server/static-server/static/${commitHash}/manifest.json`,
    occurrence: '/icons',
    replacement: `/${commitHash}/icons`,
  })
  await Copy.copyFile({
    from: 'static/index.html',
    to: `packages/build/.tmp/server/static-server/static/index.html`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/server/static-server/static/index.html`,
    occurrence: '/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js',
    replacement: `/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/server/static-server/static/index.html`,
    occurrence: '/icons',
    replacement: `/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/server/static-server/static/index.html`,
    occurrence: '/manifest.json',
    replacement: `/${commitHash}/manifest.json`,
  })
  await Replace.replace({
    path: `packages/build/.tmp/server/static-server/static/index.html`,
    occurrence: '/css',
    replacement: `/${commitHash}/css`,
  })
  await BundleCss.bundleCss({
    outDir: `packages/build/.tmp/server/static-server/static/${commitHash}/css`,
    assetDir: `/${commitHash}`,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/icons`,
  })
  await Copy.copy({
    from: 'packages/shared-process/node_modules/@lvce-editor/preview-process/files/previewInjectedCode.js',
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/js/preview-injected.js`,
  })
  await Remove.remove(`packages/build/.tmp/server/static-server/static/images`)
  await Remove.remove(`packages/build/.tmp/server/static-server/static/${commitHash}/sounds`)
  await Remove.remove(`packages/build/.tmp/server/static-server/static/${commitHash}/lib-css/modern-normalize.css`)
}

const getObjectDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [obj, ...Object.values(obj.dependencies).flatMap(getObjectDependencies)]
}

const copyStaticServerFiles = async ({ commitHash }) => {
  const etag = `W/"${commitHash}"`
  await Copy.copy({
    from: 'packages/static-server',
    to: 'packages/build/.tmp/server/static-server',
    ignore: ['tsconfig.json', 'node_modules', 'package-lock.json', 'tsconfig.tsbuildinfo', 'test'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'packages/build/.tmp/server/static-server/LICENSE',
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/IsImmutable/IsImmutable.js',
    occurrence: 'isImmutable = false',
    replacement: 'isImmutable = true',
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/Root/Root.js',
    occurrence: `export const root = resolve(__dirname, '../../../../../')`,
    replacement: `export const root = resolve(__dirname, '../../../')`,
  })
  await GetStaticFiles.getStaticFiles({ etag })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/GetResponseInfo/GetResponseInfo.js',
    occurrence: `import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.js'
import * as GetHeaders from '../GetHeaders/GetHeaders.js'
import * as GetPathEtag from '../GetPathEtag/GetPathEtag.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.js'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.js'
import * as NotModifiedResponse from '../NotModifiedResponse/NotModifiedResponse.js'

export const getResponseInfo = async (request, isImmutable) => {
  const pathname = request.url
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathname)
  const etag = await GetPathEtag.getPathEtag(absolutePath)
  if (!etag) {
    return NotFoundResponse.notFoundResponse
  }
  if (MatchesEtag.matchesEtag(request, etag)) {
    return NotModifiedResponse.notModifiedResponse
  }
  const headers = GetHeaders.getHeaders(absolutePath, etag, isImmutable)
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
`,
    replacement: `import * as GetAbsolutePath from '../GetAbsolutePath/GetAbsolutePath.js'
import * as Headers from '../Headers/Headers.js'
import * as Files from '../Files/Files.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as MatchesEtag from '../MatchesEtag/MatchesEtag.js'
import * as NotFoundResponse from '../NotFoundResponse/NotFoundResponse.js'
import * as NotModifiedResponse from '../NotModifiedResponse/NotModifiedResponse.js'

const etag = '${etag}'

export const getResponseInfo = (request, isImmutable) => {
  const pathname = request.url
  if(!Object.hasOwn(Files.files, pathname)){
    return NotFoundResponse.notFoundResponse
  }
  const index = Files.files[pathname]
  const headers = Headers.headers[index]
  const absolutePath = GetAbsolutePath.getAbsolutePath(pathname)
  if (MatchesEtag.matchesEtag(request, etag)) {
    return NotModifiedResponse.notModifiedResponse
  }
  return {
    absolutePath,
    status: HttpStatusCode.Ok,
    headers,
  }
}
`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/Headers/Headers.js',
    occurrence: `frame-ancestors 'none'`,
    replacement: `\${frameAncestors}`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/Headers/Headers.js',
    occurrence: `frame-src 'self' http://localhost:3001 http://localhost:3002`,
    replacement: `\${frameSrc}`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/Headers/Headers.js',
    occurrence: `"default-src 'none'; font-src 'self'; img-src 'self'`,
    replacement: `\`default-src 'none'; font-src 'self'; img-src 'self'`,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/Headers/Headers.js',
    occurrence: `manifest-src 'self';"`,
    replacement: `manifest-src 'self';\``,
  })
  await Replace.replace({
    path: 'packages/build/.tmp/server/static-server/src/parts/Headers/Headers.js',
    occurrence: `export const headers =`,
    replacement: `import * as GetGitpodPreviewUrl from '../GetGitpodPreviewUrl/GetGitpodPreviewUrl.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.js'

const frameSrc = IsGitpod.isGitpod ? \`frame-src 'self' \${GetGitpodPreviewUrl.getGitpodPreviewUrl(3001)} \${GetGitpodPreviewUrl.getGitpodPreviewUrl(3002)}\` : \`frame-src 'self' http://localhost:3001 http://localhost:3002\`

const frameAncestors = IsGitpod.isGitpod ? 'frame-ancestors *.gitpod.io': \`frame-ancestors 'none'\`

export const headers =`,
  })
}

const bundleStaticServer = async ({ commitHash }) => {
  await BundleJs.bundleJs({
    cwd: Path.absolute('packages/build/.tmp/server/static-server'),
    from: `./src/static-server.js`,
    platform: 'node',
    sourceMap: false,
  })
}

const bundleRendererWorkerAndRendererProcessJs = async ({ commitHash, version, date, product }) => {
  const assetDir = `/${commitHash}`
  const platform = 'remote'
  const toRoot = `packages/build/.tmp/server/static-server/static/${commitHash}`
  await BundleWorkers.bundleWorkers({
    platform,
    assetDir,
    commitHash,
    version,
    date,
    product,
    toRoot,
  })
}

const copyPlaygroundFiles = async ({ commitHash }) => {
  await Copy.copy({
    from: `packages/build/files/playground-source`,
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/playground`,
  })
}

const shouldBeCopied = (extensionName) => {
  return extensionName === 'builtin.vscode-icons' || extensionName.startsWith('builtin.theme-') || extensionName.startsWith('builtin.language-basics')
}

const copyExtensions = async ({ commitHash }) => {
  const extensionNames = await readdir(Path.absolute('extensions'))
  for (const extensionName of extensionNames) {
    if (shouldBeCopied(extensionName)) {
      await Copy.copy({
        from: `extensions/${extensionName}`,
        to: `packages/build/.tmp/server/static-server/static/${commitHash}/extensions/${extensionName}`,
      })
    }
  }
  await Copy.copy({
    from: `packages/build/.tmp/server/static-server/static/${commitHash}/extensions/builtin.vscode-icons/icons`,
    to: `packages/build/.tmp/server/static-server/static/${commitHash}/file-icons`,
  })
  await Remove.remove(`packages/build/.tmp/server/static-server/static/${commitHash}/extensions/builtin.vscode-icons/icons`)
  await Replace.replace({
    path: `packages/build/.tmp/server/static-server/static/${commitHash}/extensions/builtin.vscode-icons/icon-theme.json`,
    occurrence: '/icons',
    replacement: '/file-icons',
  })
}

export const buildStaticServer = async ({ product, commitHash, version, date }) => {
  console.time('bundleRendererWorkerAndRendererProcessJs')
  await bundleRendererWorkerAndRendererProcessJs({ commitHash, version, date, product })
  console.timeEnd('bundleRendererWorkerAndRendererProcessJs')

  console.time('copyExtensions')
  await copyExtensions({ commitHash })
  console.timeEnd('copyExtensions')

  console.time('copyPlaygroundFiles')
  await copyPlaygroundFiles({ commitHash })
  console.timeEnd('copyPlaygroundFiles')

  console.time('copyStaticFiles')
  await copyStaticFiles({ commitHash })
  console.timeEnd('copyStaticFiles')

  console.time('copyStaticServerFiles')
  await copyStaticServerFiles({ commitHash })
  console.timeEnd('copyStaticServerFiles')

  console.time('bundleStaticServer')
  await bundleStaticServer({ commitHash })
  console.timeEnd('bundleStaticServer')
}
