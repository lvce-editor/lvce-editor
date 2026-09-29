import { readdir } from 'node:fs/promises'
import * as CreateTestOverviewHtml from '../CreateTestOverviewHtml/CreateTestOverviewHtml.ts'

export const createTestOverview = async (testPathSrc: any): Promise<any> => {
  const dirents = await readdir(testPathSrc)
  const testOverviewHtml = CreateTestOverviewHtml.createTestOverviewHtml(dirents)
  return testOverviewHtml
}
