import { expect, test } from '@jest/globals'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.js'
import * as GetLocationsVirtualDom from '../src/parts/GetLocationsVirtualDom/GetLocationsVirtualDom.js'
import * as LocationType from '../src/parts/LocationType/LocationType.js'

test('does not render an empty file icon', () => {
  const dom = GetLocationsVirtualDom.getLocationsVirtualDom(
    [
      {
        icon: '',
        index: 0,
        name: 'file.js',
        type: LocationType.Expanded,
      },
    ],
    '1 result',
  )

  const location = dom[4]
  expect(location.childCount).toBe(1)
  expect(dom.some((node) => node.className === ClassNames.FileIcon)).toBe(false)
})
