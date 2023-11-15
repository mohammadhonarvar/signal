import {createLogger} from '@alwatr/logger/logger.js';

import {_actionTarget, _signalStorage, debounceTimeout} from './common.js';

import type {ContextSignalDispatchOptions, ContextSignalObject} from './type.js';

const logger = createLogger('context-signal');

/**
 * Listener `id`
 */
let _lastContextSignalListenerAutoId = 0;

const _getContextSignalObject = <T>() => <K extends keyof T = keyof T>(
  signalId: K,
): ContextSignalObject<T[K]> => {
  let signal = _signalStorage[signalId] as ContextSignalObject<T[K]> | undefined;
  if (signal == null) {
    signal = _signalStorage[signalId as string] = {
      id: signalId as string,
      disabled: false,
      debounced: false,
      detail: undefined,
      listenerList: [],
      firstDispatchedDone: false,
    };
  }

  return signal;
};

/**
 *
 * Example:
 *
 * ```ts
 * setContextSignalValue<ContentType>('content-change', { key: 5 });
 * ```
 */
export const setContextSignalValue = <T extends object>() => <K extends keyof T = keyof T>(
  signalId: K,
  value: Partial<T[K]>,
  replaceAll = false,
): ContextSignalObject<T[K]> => {
  logger.logMethodArgs?.('setContextSignalValue', {signalId, value, replaceAll});

  const signal = _getContextSignalObject<T>()(signalId);
  if (signal.detail === undefined || replaceAll) {
    signal.detail = value as T[K];
    return signal;
  }

  if (
    typeof signal.detail === 'object' &&
    !Array.isArray(signal.detail) &&
    typeof value === 'object'
  ) {
    signal.detail = {...signal.detail, ...value};
    return signal;
  }

  signal.detail = value as T[K];
  return signal;
};

/**
 * Get current signal detail/value.
 *
 * Example:
 *
 * ```ts
 * const currentContent = getContextSignalValue<ContentType>('content-change');
 * ```
 */
export const getContextSignalValue = <T extends object>() => <K extends keyof T = keyof T>(signalId: K): T[K] | undefined => {
  return _getContextSignalObject<T>()(signalId).detail;
};


export function contextDispatch<T extends object>() {
  return <K extends keyof T = keyof T>(
    signalId: K,
    value: T[K],
    options: Partial<ContextSignalDispatchOptions> = {}): void => {
    options.debounce ??= 'NextCycle';
    options.scopeName ??= 'unknown';
    options.replaceAll ??= false;

    logger.logMethodArgs?.('contextDispatch', {signalId, value, options});

    const signal = setContextSignalValue<T>()(signalId, value, options.replaceAll);
    signal.firstDispatchedDone = true;

    if (signal.disabled) return;

    const dispatchEvent = (): void => {
      _actionTarget.dispatchEvent(
          new CustomEvent(signalId as string, {
            detail: value,
          }),
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
  };
}

export function contextEditionDispatch<T extends object>() {
  return <K extends keyof T = keyof T>(
    signalId: K,
    value: Partial<T[K]>,
    options: Partial<ContextSignalDispatchOptions> = {}): void => {
    logger.logMethodArgs?.('contextEditionDispatch', {signalId, value, options});

    const signal = _getContextSignalObject<T>()(signalId);
    if (!signal.firstDispatchedDone) {
      console.warn(`Use \`contextDispatch\` for ${signalId as string} , then this function can run`);
      return;
    }

    contextDispatch<T>()(signalId, value as T[K], options);
  };
}


export function onContextDispatch<T extends object>() {
  return <K extends keyof T = keyof T>(
    signalId: K,
    callback: (detail: T[K]) => void | Promise<void>,
    options: { preserved?: boolean, runAsLatest?: boolean; once?: boolean } = {}): number => {
    options.preserved ??= true;
    logger.logMethodArgs?.('onContextDispatch', {signalId, callback, options});

    const signal = _getContextSignalObject<T>()(signalId);
    if (signal.disabled) return _lastContextSignalListenerAutoId;

    const listenerCallback = (event: CustomEvent<T[typeof signalId]>): void | Promise<void> => {
      try {
        callback(event.detail);
      }
      catch (err) {
        logger.error('onContextDispatch', 'call_signal_callback_failed', err, {
          signalId: signal.id,
        });
      }
    };

    signal.listenerList.push({
      id: ++_lastContextSignalListenerAutoId,
      signalId: signal.id,
      once: options.once ?? false,
      callback: listenerCallback,
    });

    _actionTarget.addEventListener(
    signalId as string,
    ((event: CustomEvent) => {
      if (options.runAsLatest) {
        setTimeout(() => {
          listenerCallback(event);
        }, 0);
      }
      else {
        listenerCallback(event);
      }
    }) as EventListener,
    {once: options.once},
    );

    if (options.preserved) {
      setTimeout(callback, 0, signal.detail);
    }

    return _lastContextSignalListenerAutoId;
  };
}

export function removeOnContextDispatch<T extends object>() {
  return <K extends keyof T = keyof T>(signalId: K, listenerId: number): void => {
    const signal = _signalStorage[signalId as string];
    if (signal == null) return;

    const index = signal.listenerList.findIndex((item) => item.id === listenerId);
    if (index > -1) {
      _actionTarget.removeEventListener(
        signalId as string,
        signal.listenerList[index].callback as EventListenerOrEventListenerObject,
      );
    }
  };
}

/**
 * A function to trigger actions that we need, it's async
 * @function firstContextDispatch
 * @returns {Promise<void>} promise of void
 */
export function firstContextDispatch<T extends object>() {
  return <K extends keyof T = keyof T>(signalId: K, conditionFn?: (detail: ContextSignalObject<T[K]>['detail']) => boolean): Promise<void> => {
    let canRemoveOnDispatch = false;

    return new Promise((resolve) => {
      const listenerId = onContextDispatch<T>()(signalId, (detail) => {
        if (typeof conditionFn === 'function') {
          const result = conditionFn(detail as ContextSignalObject<T[K]>['detail']);
          if (result === true) {
            canRemoveOnDispatch = true;
            resolve();
          }
        }
        else {
          resolve();
        }

        if (canRemoveOnDispatch) {
          removeOnContextDispatch<T>()(signalId, listenerId);
        }
      });
    });
  };
}
