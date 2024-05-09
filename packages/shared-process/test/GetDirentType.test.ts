import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as GetDirentType from '../src/parts/GetDirentType/GetDirentType.js'

test('getDirentType - file', () => {
  const dirent = {
    path: '',
    isFile() {
      return true
    },
    isDirectory() {
      return false
    },
    isSymbolicLink() {
      return false
    },
    isBlockDevice() {
      return false
    },
    isSocket() {
      return false
    },
    isCharacterDevice() {
      return false
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.File)
})

test('getDirentType - directory', () => {
  const dirent = {
    path: '',
    isFile() {
      return false
    },
    isDirectory() {
      return true
    },
    isSymbolicLink() {
      return false
    },
    isBlockDevice() {
      return false
    },
    isSocket() {
      return false
    },
    isCharacterDevice() {
      return false
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''

  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Directory)
})

test('getDirentType - symlink', () => {
  const dirent = {
    path: '',
    isFile() {
      return false
    },
    isDirectory() {
      return false
    },
    isSymbolicLink() {
      return true
    },
    isBlockDevice() {
      return false
    },
    isSocket() {
      return false
    },
    isCharacterDevice() {
      return false
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''

  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Symlink)
})

test('getDirentType - socket', () => {
  const dirent = {
    path: '',
    isFile() {
      return false
    },
    isDirectory() {
      return false
    },
    isSymbolicLink() {
      return false
    },
    isBlockDevice() {
      return false
    },
    isSocket() {
      return true
    },
    isCharacterDevice() {
      return false
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''

  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Socket)
})

test('getDirentType - block device', () => {
  const dirent = {
    path: '',
    isFile() {
      return false
    },
    isDirectory() {
      return false
    },
    isSymbolicLink() {
      return false
    },
    isSocket() {
      return false
    },
    isBlockDevice() {
      return true
    },
    isCharacterDevice() {
      return false
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''

  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.BlockDevice)
})

test('getDirentType - character device', () => {
  const dirent = {
    path: '',
    isFile() {
      return false
    },
    isDirectory() {
      return false
    },
    isSymbolicLink() {
      return false
    },
    isSocket() {
      return false
    },
    isBlockDevice() {
      return false
    },
    isCharacterDevice() {
      return true
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''
  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.CharacterDevice)
})

test('getDirentType - unknown', () => {
  const dirent = {
    path: '',
    isFile() {
      return false
    },
    isDirectory() {
      return false
    },
    isSymbolicLink() {
      return false
    },
    isSocket() {
      return false
    },
    isBlockDevice() {
      return false
    },
    isCharacterDevice() {
      return false
    },
    isFIFO() {
      return false
    },
    name: '',
    parentPath: ''

  }
  expect(GetDirentType.getDirentType(dirent)).toBe(DirentType.Unknown)
})
