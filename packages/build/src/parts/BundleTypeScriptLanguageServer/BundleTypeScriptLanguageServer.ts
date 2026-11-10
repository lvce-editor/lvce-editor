import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { chmod, cp, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'
import * as Tar from 'tar-fs'
import { downloadUrl } from '../DownloadUrl/DownloadUrl.ts'

export const version = '7.0.2'

// Official microsoft/typescript-go typescript/v7.0.2 assets. Never select a host binary for a cross build.
const digests: Readonly<Record<string, string>> = {
  'darwin-arm64': '902e2fe1cf0799198ef902c6b8c310a450fef629a6baba41d45641ef75c04ebd',
  'darwin-x64': 'eba158cb54050f723d5ff781438f33de5640054440bb4f2bd170cfe9bc2eb551',
  'linux-arm': '33a15a7badb207a38957373c410b970319baac8960109232ab64502497caea06',
  'linux-arm64': 'c83d931ac9dd7549cde6e71246aa9d6a9812843023df3e277fe3b5dcf41dd0ea',
  'linux-x64': '7ecad6f67377e831856367ab062ef394f21506a611405bf8ac0ff039348637d3',
  'win32-arm64': '0a73534e6ee50cdbb2a29ac48657ca0ad13cf0f424cf63808e4df7baeb87b8be',
  'win32-x64': '61fc4e141d2bc687db580e71bbfa63b9c209f0310645d82ca1b457eb3a24fd19',
}

export const getTypeScriptTarget = (platform: string, arch: string) => {
  const target = `${platform}-${arch === 'armv7l' ? 'arm' : arch}`
  const digest = digests[target]
  if (!digest) {
    throw new Error(`Unsupported TypeScript language server target: ${platform}-${arch}`)
  }
  return {
    digest,
    executable: platform === 'win32' ? 'tsc.exe' : 'tsc',
    target,
    url: `https://github.com/microsoft/typescript-go/releases/download/typescript/v${version}/typescript-${target}.tgz`,
  }
}

export const bundleTypeScriptLanguageServer = async ({
  to,
  platform,
  arch,
}: {
  readonly to: string
  readonly platform: string
  readonly arch: string
}): Promise<void> => {
  const { digest, executable, url } = getTypeScriptTarget(platform, arch)
  const temporary = await mkdtemp(join(tmpdir(), 'lvce-typescript-'))
  try {
    const archive = join(temporary, 'typescript.tgz')
    await downloadUrl(url, archive)
    const actualDigest = createHash('sha256')
      .update(await readFile(archive))
      .digest('hex')
    if (actualDigest !== digest) {
      throw new Error(`TypeScript archive checksum mismatch for ${platform}-${arch}`)
    }
    const extracted = join(temporary, 'extracted')
    await pipeline(createReadStream(archive), createGunzip(), Tar.extract(extracted))
    const source = join(extracted, 'package')
    await chmod(join(source, 'lib', executable), 0o755)
    await mkdir(dirname(to), { recursive: true })
    await rm(to, { force: true, recursive: true })
    await cp(source, to, { recursive: true })
  } finally {
    await rm(temporary, { force: true, recursive: true })
  }
}
