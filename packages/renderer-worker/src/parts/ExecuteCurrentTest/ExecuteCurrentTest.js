import * as GetTestFilePath from '../GetTestFilePath/GetTestFilePath.js'
import * as Test from '../Test/Test.js'

const allTestsFileName = '_all.html'

const isAllTestsHref = (href) => {
  const url = new URL(href)
  return url.pathname.endsWith(`/tests/${allTestsFileName}`)
}

const getTestOverviewUrl = (href) => {
  return new URL('/tests/', href).href
}

const getTestLinks = async (href) => {
  const response = await fetch(getTestOverviewUrl(href))
  const text = await response.text()
  const matches = text.matchAll(/href="\.\/([^"]+\.html)"/g)
  return [...matches].map((match) => match[1])
}

const toTestName = (htmlFileName) => {
  return htmlFileName.replace(/\.html$/, '.js')
}

const getTestHref = (href, htmlFileName) => {
  return new URL(htmlFileName, getTestOverviewUrl(href)).href
}

const getFilteredTestLinks = (href, links) => {
  const url = new URL(href)
  const filter = url.searchParams.get('filter')
  if (!filter) {
    return links
  }
  return links.filter((link) => toTestName(link).includes(filter))
}

const getAllTests = async (platform, href) => {
  const links = await getTestLinks(href)
  const filteredLinks = getFilteredTestLinks(href, links)
  const tests = []
  for (const link of filteredLinks) {
    const testHref = getTestHref(href, link)
    const url = await GetTestFilePath.getTestFilePath(platform, testHref)
    tests.push({
      name: toTestName(link),
      url,
    })
  }
  return tests
}

export const executeCurrentTest = async (platform, initData) => {
  const href = initData.Location.href
  if (isAllTestsHref(href)) {
    const tests = await getAllTests(platform, href)
    await Test.executeAll(tests, href)
    return
  }
  const jsPath = await GetTestFilePath.getTestFilePath(platform, href)
  await Test.execute(jsPath)
}
