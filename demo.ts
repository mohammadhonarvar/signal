import { contextDispatch, onContextDispatch, setContextSignalValue } from './dist/index.js';
import { dispatch, onDispatch } from './dist/simple-signal.js';

declare global {
  interface ContextSignalList {
    mhf: { data: string }
  }

  type SimpleSignalList = 'x' | 'y';
}

const _contextDispatch = contextDispatch<ContextSignalList>;

_contextDispatch('mhf', { data: 'test' });
setContextSignalValue<ContextSignalList>('mhf', { data: 'test2' })

setTimeout(() => {
  onContextDispatch<ContextSignalList>('mhf', () => { console.log('MHF: value => '); }, { preserved: false });
}, 5000);

const _dispatch = dispatch<SimpleSignalList>;
const _onDispatch = onDispatch<SimpleSignalList>;

_dispatch('x');
setTimeout(() => {
  _onDispatch('x', () => { console.log('MHF: value => '); }, { preserved: false });
}, 5000);