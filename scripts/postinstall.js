import { execa } from 'execa'

const exec = async (command) => {
  console.info(command)
  await execa(command, {
    shell: true,
    stdio: 'inherit',
  })
}

// prettier-ignore
const applyLernaBugWorkaround =async  () => {
  // workaround for https://github.com/lerna/lerna/issues/2352
  await exec(`cd packages/extension-host && npm ci --prefer-offline && cd ../../`);
  await exec(`cd packages/main-process && npm ci --prefer-offline && cd ../../`);
  await exec(`cd packages/pty-host && npm ci --prefer-offline && cd ../../`);
  await exec(`cd packages/shared-process && npm ci --prefer-offline && cd ../../`);
  await exec(`cd packages/server && npm ci --prefer-offline && cd ../../`);
}

const main = async () => {
  await applyLernaBugWorkaround()
  await import(
    '../build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.js'
  )
  await import('./use-sample-data.js')
}

main()
