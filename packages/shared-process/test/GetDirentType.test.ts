import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetDirentType from '../src/parts/GetDirentType/GetDirentType.js'

test('getDirentType - file', () => {
  const dirent = {
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return true
    },
    isSocket(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.File)
})

test('getDirentType - directory', () => {
  const dirent = {
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isDirectory(): any {
      return true
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Directory)
})

test('getDirentType - symlink', () => {
  const dirent = {
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isSymbolicLink(): any {
      return true
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Symlink)
})

test('getDirentType - socket', () => {
  const dirent = {
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return false
    },
    isSocket(): any {
      return true
    },
    isSymbolicLink(): any {
      return false
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Socket)
})

test('getDirentType - block device', () => {
  const dirent = {
    isBlockDevice(): any {
      return true
    },
    isCharacterDevice(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.BlockDevice)
})

test('getDirentType - character device', () => {
  const dirent = {
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return true
    },
    isDirectory(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.CharacterDevice)
})

test('getDirentType - unknown', () => {
  const dirent = {
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    isFile(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    name: '',
    parentPath: '',
    path: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Unknown)
})
