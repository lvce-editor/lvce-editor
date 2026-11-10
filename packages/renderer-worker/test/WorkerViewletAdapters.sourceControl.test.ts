import { beforeEach, expect, test } from '@jest/globals'
import * as Context from '../src/parts/Context/Context.js'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.js'
import * as FocusState from '../src/parts/FocusState/FocusState.js'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.js'
import { getWorkerViewletAdapter } from '../src/parts/WorkerViewletAdapterMap/WorkerViewletAdapterMap.js'

beforeEach(() => {
	Context.reset()
	FocusState.set(WhenExpression.Empty)
})

test('source control input focus updates the application keyboard context', async () => {
	const state = { uid: 1 }
	const adapter = getWorkerViewletAdapter('sourceControl')
	const wrappedCommand = (wrappedState: Readonly<typeof state>, ..._args: readonly unknown[]): Readonly<typeof state> => {
		expect(Context.get(FocusKey.SourceControlInput)).toBe(true)
		return wrappedState
	}
	const defaultWrapCommand = (_command: string): typeof wrappedCommand => wrappedCommand

	const command = adapter.wrapCommand('handleFocus', defaultWrapCommand)
	await command(state, 'extra')

	expect(FocusState.get()).toBe(FocusKey.SourceControlInput)
})

test('other source control commands do not update the application keyboard context', async () => {
	const state = { uid: 1 }
	const adapter = getWorkerViewletAdapter('sourceControl')
	const wrappedCommand = (wrappedState: Readonly<typeof state>): Readonly<typeof state> => wrappedState
	const defaultWrapCommand = (_command: string): typeof wrappedCommand => wrappedCommand

	const command = adapter.wrapCommand('handleInput', defaultWrapCommand)
	await command(state)

	expect(Context.get(FocusKey.SourceControlInput)).toBeUndefined()
	expect(FocusState.get()).toBe(WhenExpression.Empty)
})
