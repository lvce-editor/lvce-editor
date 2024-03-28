import * as ArchType from '../ArchType/ArchType.js'
import * as Copy from '../Copy/Copy.js'
import * as CreateSnap from '../CreateSnap/CreateSnap.js'
import * as Logger from '../Logger/Logger.js'
import * as Template from '../Template/Template.js'
import * as Version from '../Version/Version.js'

// TODO get rid of no-sandbox somehow https://github.com/electron/electron/issues/17972

const getSnapArch = (arch) => {
  switch (arch) {
    case ArchType.X64:
      return 'amd64'
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}

const copyMetaFiles = async ({ arch, product, version }) => {
  const snapArch = getSnapArch(arch)
  await Template.write('linux_snapcraft_yaml', `build/.tmp/linux/snap/${arch}/snap/snapcraft.yaml`, {
    '@@SNAP_NAME@@': product.snapName,
    '@@NAME@@': product.applicationName,
    '@@VERSION@@': version,
    '@@ARCHITECTURE@@': snapArch,
    '@@SUMMARY@@': product.linuxSummary,
    '@@SOURCE_CODE@@': product.repoUrl,
    '@@LICENSE@@': product.licenseName,
  })
  // TODO vscode has an electron launch file (not yet sure if that is needed)
  await Template.write('linux_desktop', `build/.tmp/linux/snap/${arch}/snap/gui/${product.applicationName}.desktop`, {
    '@@NAME_LONG@@': product.nameLong,
    '@@NAME_SHORT@@': product.nameShort,
    '@@NAME@@': product.applicationName,
    '@@EXEC@@': product.applicationName,
    '@@ICON@@': `\${SNAP}/meta/gui/${product.applicationName}.png`,
    '@@URLPROTOCOL@@': product.applicationName,
    '@@SUMMARY@@': product.linuxSummary,
    '@@KEYWORDS@@': `${product.applicationName};`,
    '@@APPLICATION_NAME@@': product.applicationName,
  })
}

const copyCode = async (arch) => {
  // top level
  await Copy.copyFile({
    from: 'lerna.json',
    to: `build/.tmp/linux/snap/${arch}/files/lerna.json`,
  })
  await Copy.copyFile({
    from: 'package.json',
    to: `build/.tmp/linux/snap/${arch}/files/package.json`,
  })
  await Copy.copyFile({
    from: 'package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/package-lock.json`,
  })

  // build
  await Copy.copyFile({
    from: 'build/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/build/package.json`,
  })
  await Copy.copyFile({
    from: 'build/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/build/package-lock.json`,
  })
  await Copy.copy({
    from: 'build/src',
    to: `build/.tmp/linux/snap/${arch}/files/build/src`,
  })
  await Copy.copy({
    from: 'build/bin',
    to: `build/.tmp/linux/snap/${arch}/files/build/bin`,
  })

  // extensions
  await Copy.copy({
    from: 'extensions/builtin.language-basics-python/src',
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-python/src`,
  })
  await Copy.copy({
    from: 'extensions/builtin.language-basics-javascript/src',
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-javascript/src`,
  })
  await Copy.copy({
    from: `extensions/builtin.language-basics-html/src`,
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-html/src`,
  })
  await Copy.copy({
    from: `extensions/builtin.language-basics-go/src`,
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-go/src`,
  })

  // main process
  await Copy.copyFile({
    from: 'packages/main-process/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/main-process/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/main-process/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/main-process/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/main-process/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/main-process/src`,
  })

  // renderer process
  await Copy.copyFile({
    from: 'packages/renderer-process/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-process/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/renderer-process/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-process/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-process/src`,
  })

  // renderer worker
  await Copy.copyFile({
    from: 'packages/renderer-worker/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-worker/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-worker/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-worker/src`,
  })

  // shared process
  await Copy.copyFile({
    from: 'packages/shared-process/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/shared-process/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/shared-process/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/shared-process/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/shared-process/src`,
  })
}

const copyExtensions = async (arch) => {}

const printSnapSize = async ({ arch, product, version }) => {
  const Stat = await import('../Stat/Stat.js')
  const snapArch = getSnapArch(arch)
  const size = await Stat.getFileSize(`build/.tmp/linux/snap/${arch}/${product.applicationName}_${version}_${snapArch}.snap`)
  Logger.info(`snap size: ${size}`)
}

// TODO automatically run bundleCode if not exists

export const build = async ({ product }) => {
  const arch = 'x64'
  const version = await Version.getVersion()

  console.time('copyMetaFiles')
  await copyMetaFiles({ arch, product, version })
  console.timeEnd('copyMetaFiles')

  console.time('copyCode')
  await copyCode(arch)
  console.timeEnd('copyCode')

  console.time('createSnap')
  await CreateSnap.createSnap(arch)
  console.timeEnd('createSnap')

  await printSnapSize({ arch, product, version })
}
