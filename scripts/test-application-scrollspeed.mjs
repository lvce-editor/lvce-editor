import assert from 'node:assert/strict'

// Application-wide settings coverage: use the existing direct-editor source-runtime
// fixture and exercise the published view workers through native DOM wheel events.
export const test = async ({ page }) => {
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const worker = page.workers().find((entry) => /\/renderer-worker\/(?:src|dist)\/rendererWorkerMain/.test(entry.url()))
  assert.ok(worker, 'Renderer worker must be running')
  await worker.evaluate(async () => {
    const root = '/packages/renderer-worker/src/parts/'
    const [Command, Preferences, ViewletStates, ViewletManager, RendererProcess, EditorWorker] = await Promise.all([
      import(`${root}Command/Command.js`),
      import(`${root}Preferences/Preferences.js`),
      import(`${root}ViewletStates/ViewletStates.js`),
      import(`${root}ViewletManager/ViewletManager.js`),
      import(`${root}RendererProcess/RendererProcess.js`),
      import(`${root}EditorWorker/EditorWorker.ts`),
    ])
    globalThis.scrollTest = {
      Command,
      Preferences,
      ViewletStates,
      EditorWorker,
      async snapshot(moduleId) {
        const instance = ViewletStates.getInstance(moduleId)
        if (moduleId === 'EditorText') return EditorWorker.invoke('Editor.getComponentState', instance.state.uid)
        return instance.factory.getComponentState(instance.state)
      },
      async seed(moduleId, scrollSensitivity) {
        const instance = ViewletStates.getInstance(moduleId)
        const current = await instance.factory.getComponentState(instance.state)
        const items = Array.from({ length: 200 }, (_, index) =>
          moduleId === 'Search'
            ? { type: 2, text: `result ${index}`, start: 0, end: 6, lineNumber: index + 1, depth: 1 }
            : {
                id: `scroll.extension-${index}`,
                name: `Extension ${index}`,
                publisher: 'Scroll test',
                description: 'Scrolling fixture',
                builtin: true,
                status: 0,
                icon: '',
              },
        )
        const listHeight = current.height - current.headerHeight
        const next = await instance.factory.setComponentState(instance.state, {
          ...current,
          ...(scrollSensitivity === undefined ? {} : { scrollSensitivity }),
          items,
          listItems: items,
          initial: false,
          loaded: true,
          message: '',
          fileCount: 1,
          matchCount: 200,
          deltaY: 0,
          minLineY: 0,
          maxLineY: Math.ceil(listHeight / current.itemHeight),
          finalDeltaY: items.length * current.itemHeight - listHeight,
          scrollBarHeight: 30,
          scrollBarY: 0,
        })
        const commands = ViewletManager.render(instance.factory, instance.renderedState, next)
        ViewletStates.setRenderedState(instance.state.uid, next)
        await RendererProcess.invoke('Viewlet.sendMultiple', commands)
      },
    }
    await Command.execute('Editor.setText', Array.from({ length: 300 }, (_, index) => `line ${index}`).join('\n'))
  })
  const speed = (value) => worker.evaluate((value) => globalThis.scrollTest.Preferences.update({ 'application.scrollspeed': value }), value)
  const snapshot = (moduleId) => worker.evaluate((moduleId) => globalThis.scrollTest.snapshot(moduleId), moduleId)
  const wheel = async (selector, deltaY) =>
    page
      .locator(selector)
      .first()
      .evaluate((target, deltaY) => {
        target.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaMode: 0, deltaY }))
      }, deltaY)
  const waitForDelta = async (moduleId, expected) => {
    await assertEventually(async () => (await snapshot(moduleId)).deltaY, expected, `${moduleId} scroll offset`)
  }
  const results = []
  const verify = async (moduleId, selector) => {
    let baseline
    for (const factor of [1, 1.5, 3]) {
      await speed(factor)
      await wheel(selector, -1e7)
      await waitForDelta(moduleId, 0)
      await wheel(selector, 80)
      if (baseline === undefined) {
        await assertEventually(async () => (await snapshot(moduleId)).deltaY > 0, true, `${moduleId} moves`)
        baseline = (await snapshot(moduleId)).deltaY
      }
      await waitForDelta(moduleId, baseline * factor)
      results.push({ view: moduleId, factor, deltaY: (await snapshot(moduleId)).deltaY })
      await wheel(selector, -40)
      await waitForDelta(moduleId, (baseline * factor) / 2)
      await wheel(selector, 1e7)
      const bottom = await snapshot(moduleId)
      await waitForDelta(moduleId, bottom.finalDeltaY)
      await wheel(selector, 80)
      await waitForDelta(moduleId, bottom.finalDeltaY)
    }
    for (const invalid of [0, 4, '3']) {
      await speed(invalid)
      await wheel(selector, -1e7)
      await waitForDelta(moduleId, 0)
      await wheel(selector, 80)
      await waitForDelta(moduleId, baseline)
    }
    assert.ok(await page.locator(selector).first().isVisible(), `${moduleId} remains visible`)
  }
  try {
    await verify('EditorText', '.EditorContent')
    for (const [moduleId, selector] of [
      ['Search', '.Search .TreeItems'],
      ['Extensions', '.Extensions .ListItems'],
    ]) {
      await worker.evaluate((moduleId) => globalThis.scrollTest.Command.execute('Layout.openSideBarViewlet', moduleId), moduleId)
      await worker.evaluate((moduleId) => globalThis.scrollTest.seed(moduleId), moduleId)
      await verify(moduleId, selector)
      if (moduleId === 'Extensions') {
        // Exercise the existing Firefox coefficient in the actual published handler.
        await worker.evaluate(() => globalThis.scrollTest.seed('Extensions', 2.5))
        await verify(moduleId, selector)
      }
    }
    await worker.evaluate(async () => {
      await globalThis.scrollTest.Command.execute(
        'QuickPick.showCustom',
        Array.from({ length: 200 }, (_, index) => ({ label: `Item ${index}` })),
        { waitUntil: 'visible' },
      )
    })
    const firstIndex = async () => Number(await page.locator('.QuickPick [role="option"]').first().getAttribute('aria-posinset'))
    for (const factor of [1, 1.5, 3]) {
      await speed(factor)
      await wheel('.QuickPickItems', -1e7)
      await assertEventually(firstIndex, 1, 'Quick pick top clamp')
      await wheel('.QuickPickItems', 44)
      await assertEventually(firstIndex, 1 + 2 * factor, 'Quick pick relative movement')
      results.push({ view: 'QuickPick', factor, firstIndex: await firstIndex() })
      await wheel('.QuickPickItems', -44)
      await assertEventually(firstIndex, 1, 'Quick pick reverse direction')
      await wheel('.QuickPickItems', 1e7)
      await assertEventually(
        async () => Number(await page.locator('.QuickPick [role="option"]').last().getAttribute('aria-posinset')),
        200,
        'Quick pick bottom clamp',
      )
    }
    console.log(`Application scrollspeed acceptance: ${JSON.stringify(results)}`)
  } finally {
    await speed(1)
  }
}

const assertEventually = async (read, expected, label) => {
  const deadline = Date.now() + 10_000
  let actual
  do {
    actual = await read()
    if (actual === expected) return
    await new Promise((resolve) => setTimeout(resolve, 20))
  } while (Date.now() < deadline)
  assert.equal(actual, expected, label)
}
