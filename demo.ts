import {contextDispatch, onContextDispatch, setContextSignalValue} from './dist/index.js';
import {dispatch, onDispatch} from './dist/simple-signal.js';

declare global {
  interface ContextSignalList {
    mhf: { data: string }
    test: number;
  }

  type SimpleSignalList = 'x' | 'y';
}

const signalContextDispatch = contextDispatch<ContextSignalList>();
const signalOnContextDispatch = onContextDispatch<ContextSignalList>();
const signalSetContextValue = setContextSignalValue<ContextSignalList>();

signalContextDispatch('mhf', {data: 'test'});
signalSetContextValue('mhf', {});

setTimeout(() => {
  signalOnContextDispatch('mhf', (data) => {console.log('MHF: value => ', data);}, {preserved: false});
}, 5000);

const _dispatch = dispatch<SimpleSignalList>;
const _onDispatch = onDispatch<SimpleSignalList>;

_dispatch('x');
setTimeout(() => {
  _onDispatch('x', () => {console.log('MHF: value => ');}, {preserved: false});
}, 5000);
