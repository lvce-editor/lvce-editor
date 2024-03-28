import * as PartitionEditorGroups from '../src/parts/PartitionEditorGroups/PartitionEditorGroups.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('partitionEditorGroups - new group added', () => {
  const oldGroups = []
  const newGroups = [
    {
      uid: 1,
    },
  ]
  expect(PartitionEditorGroups.partitionEditorGroups(oldGroups, newGroups)).toEqual({
    deletedGroups: [],
    insertedGroups: [
      {
        uid: 1,
      },
    ],
    updatedGroups: [],
  })
})

test('partitionEditorGroups - group removed', () => {
  const oldGroups = [
    {
      uid: 1,
    },
  ]
  const newGroups = []
  expect(PartitionEditorGroups.partitionEditorGroups(oldGroups, newGroups)).toEqual({
    deletedGroups: [
      {
        uid: 1,
      },
    ],
    insertedGroups: [],
    updatedGroups: [],
  })
})
