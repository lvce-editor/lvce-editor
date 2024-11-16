import { readdir } from 'node:fs/promises'
import * as CreateTestOverviewHtml from '../CreateTestOverviewHtml/CreateTestOverviewHtml.js'

export const createTestOverview = async (testPathSrc) => {
  const dirents = await readdir(testPathSrc)
  const testOverviewHtml = CreateTestOverviewHtml.createTestOverviewHtml(dirents)
  return testOverviewHtml
}
