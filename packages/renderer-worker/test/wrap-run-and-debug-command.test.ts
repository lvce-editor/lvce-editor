import {expect, jest, test} from '@jest/globals';

const invoke = jest.fn(async (command: string, ..._args: readonly unknown[]): Promise<unknown> => {
	if (command === 'RunAndDebug.diff2') {
		return [1];
	}

	if (command === 'RunAndDebug.render2') {
		return [['Viewlet.setDom2']];
	}

	return command === 'RunAndDebug.renderActions' ? [{title: 'Start'}] : undefined;
});
const getByUid = jest.fn<() => {state: {uid: number}} | undefined>(() => ({state: {uid: 7}}));
const getState = jest.fn(() => ({uid: 7, marker: 'latest'}));

jest.unstable_mockModule('../src/parts/DebugWorker/DebugWorker.js', () => ({invoke}));
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({getByUid, getState}));

const {wrapRunAndDebugCommand} = await import('../src/parts/WrapRunAndDebugCommand/WrapRunAndDebugCommand.ts');

test('returns the original state when the viewlet is disposed during loading', async () => {
	const state = {uid: 7};
	getByUid.mockReturnValueOnce(undefined);

	expect(await wrapRunAndDebugCommand('loadContentLater')(state)).toBe(state);
	expect(getState).not.toHaveBeenCalled();
});

test('renders updated state while the original viewlet remains active', async () => {
	getByUid.mockReturnValueOnce({state: {uid: 7}});

	expect(await wrapRunAndDebugCommand('loadContentLater')({uid: 7})).toEqual({
		uid: 7, marker: 'latest', commands: [['Viewlet.setDom2']], actionsDom: [{title: 'Start'}],
	});
	expect(getState).toHaveBeenCalled();
});
