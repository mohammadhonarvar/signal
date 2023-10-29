import {createLogger} from '@alwatr/logger/logger.js';

import {_actionTarget, _signalStorage, debounceTimeout} from './common.js';

import type {DispatchOptions, SignalObject} from './type.js';

const logger = createLogger('simple-signal');

/**
 * Listener `id`
 */
let _lastListenerAutoId = 0;

const _getSimpleSignalObject = <T>(
  signalId: T,
): SignalObject => {
  let signal = _signalStorage[signalId] as SignalObject | undefined;
  if (signal == null) {
    signal = _signalStorage[signalId as string] = {
      id: signalId as string,
      disabled: false,
      debounced: false,
      listenerList: [],
    };
  }

  return signal;
};


export function dispatch<T>(
    signalId: T,
    options: Partial<DispatchOptions> = {}): void {
  options.debounce ??= 'NextCycle';

  logger.logMethodArgs?.('dispatch', {signalId, options});

  const signal = _getSimpleSignalObject(signalId);
  if (signal.disabled) return;

  const dispatchEvent = (): void => {
    _actionTarget.dispatchEvent(
        new CustomEvent(signalId as string),
    );
  };

  if (options.debounce === 'No') {
    dispatchEvent();
    return;
  }

  // else
  if (options.debounce === 'NextCycle') {
    setTimeout(dispatchEvent, 0);
    return;
  }

  // else
  if (signal.debounced === true) {
    return; // last dispatch in progress.
  }

  // else
  signal.debounced = true;
  options.debounce === 'AnimationFrame'
    ? requestAnimationFrame(dispatchEvent)
    : setTimeout(dispatchEvent, debounceTimeout);
}

export function onDispatch<T>(
    signalId: T,
    callback: () => void | Promise<void>,
    options: { preserved?: boolean, runAsLatest?: boolean; once?: boolean } = {}): number {
  options.preserved ??= true;
  logger.logMethodArgs?.('onDispatch', {signalId, callback, options});

  const signal = _getSimpleSignalObject(signalId);
  if (signal.disabled) return _lastListenerAutoId;

  const listenerCallback = (): void | Promise<void> => {
    try {
      callback();
    }
    catch (err) {
      logger.error('onContextDispatch', 'call_signal_callback_failed', err, {
        signalId: signal.id,
      });
    }
  };

  signal.listenerList.push({
    id: ++_lastListenerAutoId,
    signalId: signal.id,
    once: options.once ?? false,
    callback: listenerCallback,
  });

  _actionTarget.addEventListener(
    signalId as string,
    (() => {
      if (options.runAsLatest) {
        setTimeout(() => {
          listenerCallback();
        }, 0);
      }
      else {
        listenerCallback();
      }
    }) as EventListener,
    {once: options.once},
  );

  if (options.preserved) {
    setTimeout(callback, 0);
  }

  return _lastListenerAutoId;
}

export function removeOnDispatch<T>(signalId: T, listenerId: number): void {
  const signal = _signalStorage[signalId as string];
  if (signal == null) return;

  const index = signal.listenerList.findIndex((item) => item.id === listenerId);
  if (index > -1) {
    _actionTarget.removeEventListener(
      signalId as string,
      signal.listenerList[index].callback as EventListenerOrEventListenerObject,
    );
  }
}

/**
 * A function to trigger actions that we need, it's async
 * @function firstContextDispatch
 * @returns {Promise<void>} promise of void
 */
export function firstDispatch<T>(signalId: T): Promise<void> {
  return new Promise((resolve) => {
    const listenerId = onDispatch<T>(signalId, () => {
      resolve();
      removeOnDispatch(signalId, listenerId);
    });
  });
}
