import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetDirentType from '../src/parts/GetDirentType/GetDirentType.js'

test('getDirentType - file', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return true
    },
    isDirectory(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    isBlockDevice(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.File)
})

test('getDirentType - directory', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return false
    },
    isDirectory(): any {
      return true
    },
    isSymbolicLink(): any {
      return false
    },
    isBlockDevice(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Directory)
})

test('getDirentType - symlink', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isSymbolicLink(): any {
      return true
    },
    isBlockDevice(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Symlink)
})

test('getDirentType - socket', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    isBlockDevice(): any {
      return false
    },
    isSocket(): any {
      return true
    },
    isCharacterDevice(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Socket)
})

test('getDirentType - block device', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isBlockDevice(): any {
      return true
    },
    isCharacterDevice(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.BlockDevice)
})

test('getDirentType - character device', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return true
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.CharacterDevice)
})

test('getDirentType - unknown', () => {
  const dirent = {
    path: '',
    isFile(): any {
      return false
    },
    isDirectory(): any {
      return false
    },
    isSymbolicLink(): any {
      return false
    },
    isSocket(): any {
      return false
    },
    isBlockDevice(): any {
      return false
    },
    isCharacterDevice(): any {
      return false
    },
    isFIFO(): any {
      return false
    },
    name: '',
    parentPath: '',
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Unknown)
})
