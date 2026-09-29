import { expect, test } from '@jest/globals'
import * as PatchDefaultElectronCliArgs from '../src/parts/PatchDefaultElectronCliArgs/PatchDefaultElectronCliArgs.ts'

test('removes the application directory from default Electron CLI arguments', () => {
  const source = `if (argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\\\electron.exe')) {\n  parsedArgs._ = parsedArgs._.slice(1);\n}`
  const result = PatchDefaultElectronCliArgs.patchDefaultElectronCliArgs(source)
  expect(result).toContain('if (process.defaultApp || argv[0].endsWith')
  expect(result).toContain('parsedArgs._ = parsedArgs._.slice(1)')
})

test('fails if the generated main-process parser changes unexpectedly', () => {
  expect(() => PatchDefaultElectronCliArgs.patchDefaultElectronCliArgs('const main = 1')).toThrow('Could not find Electron CLI argument parsing block')
})
