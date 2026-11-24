import { expect, test } from '@jest/globals'
import minimist from 'minimist'
import { runInNewContext } from 'node:vm'
import * as PatchDefaultElectronCliArgs from '../src/parts/PatchDefaultElectronCliArgs/PatchDefaultElectronCliArgs.ts'

const source = `(argv) => {
  const relevantArgv = argv.slice(1);
  const parsedArgs = minimist(relevantArgv, { boolean: ['wait'] });
  if (argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\\\electron.exe')) {
    parsedArgs._ = parsedArgs._.slice(1);
  }
  return parsedArgs;
}`

const parseCliArgs = (argv: string[], platform: NodeJS.Platform, defaultApp?: boolean): { _: string[]; wait: boolean } =>
  runInNewContext(PatchDefaultElectronCliArgs.patchDefaultElectronCliArgs(source), { minimist, process: { platform, defaultApp } })(argv)

test.each([
  ['one app path', ['/usr/lib/lvce-oss']],
  ['a repeated app path', ['/usr/lib/lvce-oss', '/usr/lib/lvce-oss']],
])('preserves CLI commands and flags with %s under system Electron', (_name, paths) => {
  const args = parseCliArgs(['/usr/lib/electron45/electron', '--enable-features=Example', ...paths, 'list', '--wait'], 'linux', true)
  expect(args).toMatchObject({ _: ['list'], wait: true })
})

test('preserves an explicit file or directory argument matching the app path', () => {
  const appPath = '/usr/lib/lvce-oss'
  expect(parseCliArgs(['/usr/lib/electron45/electron', appPath, '--', appPath], 'linux', true)._).toEqual([appPath])
})

test('preserves positional arguments when running the packaged executable directly', () => {
  expect(parseCliArgs(['/usr/bin/lvce-oss', 'file.txt', '--wait'], 'linux')).toMatchObject({ _: ['file.txt'], wait: true })
})

test('preserves app path handling for the bundled development Electron executable', () => {
  expect(parseCliArgs(['C:\\electron\\dist\\electron.exe', 'C:\\app', 'file.txt'], 'win32')._).toEqual(['file.txt'])
})

test('fails if the generated main-process parser changes unexpectedly', () => {
  expect(() => PatchDefaultElectronCliArgs.patchDefaultElectronCliArgs('const main = 1')).toThrow('Could not find Electron CLI argument parsing block')
})
