import * as Exec from '../Exec/Exec.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Template from '../Template/Template.js'
import * as Copy from '../Copy/Copy.js'

const getRpmArch = (arch) => {
  switch (arch) {
    case 'x64':
      return 'x86_64'
    case 'armhf':
      return 'armv7hl'
    case 'arm64':
      return 'aarch64'
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}

const copyMetaFiles = async (arch) => {
  const rpmArch = getRpmArch(arch)
  await Template.write(
    'linux_desktop',
    `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/BUILD/usr/share/applications/${Product.applicationName}.desktop`,
    {
      '@@NAME_LONG@@': Product.nameLong,
      '@@NAME_SHORT@@': Product.nameShort,
      '@@NAME@@': Product.applicationName,
      '@@EXEC@@': Product.applicationName,
      '@@ICON@@': Product.applicationName,
      '@@URLPROTOCOL@@': Product.applicationName,
      '@@SUMMARY@@': Product.linuxSummary,
      '@@KEYWORDS@@': `${Product.applicationName};`,
    }
  )
  await Template.write(
    'linux_app_data_xml',
    `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/BUILD/usr/share/appdata/${Product.applicationName}.appdata.xml`,
    {
      '@@NAME_LONG@@': Product.nameLong,
      '@@NAME@@': Product.applicationName,
      '@@LICENSE@@': Product.licenseName,
      '@@HOMEPAGE@@': Product.homePage,
      '@@SUMMARY@@': Product.linuxSummary,
    }
  )
  await Copy.copyFile({
    from: 'build/files/icon.png',
    to: `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/${Product.applicationName}/usr/share/pixmaps/${Product.applicationName}.png`,
  })
}

const createRpm = async (arch) => {
  const rpmArch = getRpmArch(arch)
  const cwd = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}/rpmbuild`)
  const rpmBuildPath = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}/rpmbuild`)
  const rpmOut = Path.absolute(
    `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/RPMS/${rpmArch}`
  )
  const destination = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}`)
  const specPath = Path.absolute(
    `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/SPECS/${Product.applicationName}.spec`
  )
  await Exec.exec(
    'fakeroot',
    [`rpmbuild --bb ${specPath} --target=${rpmArch}`],
    {
      env: {
        HOME: destination,
      },
    }
  )
}

export const build = async () => {
  const arch = 'x64'

  console.time('copyMetaFiles')
  await copyMetaFiles(arch)
  console.timeEnd('copyMetaFiles')

  console.time('createRpm')
  await createRpm(arch)
  console.timeEnd('createRpm')
}
