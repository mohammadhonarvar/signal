import {globalAlwatr} from '@alwatr/logger/logger.js';

import type {SignalStorage} from './type.js';

globalAlwatr.registeredList.push({
  name: 'signal',
  version: '1.0.0',
});

export const debounceTimeout = 5;

/**
 * Signal stack database.
 */
export const _signalStorage: SignalStorage = {};

export const _actionTarget: EventTarget | Element =
  'eventTarget' in window ? new EventTarget() : document.createElement('span');

export function removeSignal<T extends Record<string, unknown>>(signalId: keyof T, prune = false): void {
  const signal = _signalStorage[signalId as string];
  if (signal == null) return;

  for (const listener of signal.listenerList) {
    _actionTarget.removeEventListener(
      signalId as string,
      listener.callback as EventListenerOrEventListenerObject,
    );
  }

  if (prune) {
    delete _signalStorage[signalId as string];
    return;
  }

  signal.listenerList.length = 0;
}

/**
 * A function to empty signal object
 * @function resetSignalObject
 * @returns {void} void
 */
export function resetSignalObject(): void {
  const signalIds = Object.keys(_signalStorage);

  for (const signalId of signalIds) {
    removeSignal((signalId as string), true);
  }
}
