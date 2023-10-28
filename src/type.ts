export type DebounceType = 'No' | 'NextCycle' | 'AnimationFrame' | 'Timeout';

/**
 * Object that can be JSON.stringify.
 */
export type Stringifyable =
    | string
    | number
    | boolean
    | null
    | undefined
    | { [P: string]: Stringifyable }
    | Stringifyable[];

export type StringifyableRecord = Record<string, Stringifyable>;

/**
 * dispatchSignal options type
 */
export interface DispatchOptions {
  /**
   * If 'AnimationFrame' or 'Timeout', the dispatch will be debounced (single dispatch for all changes).
   *
   * If 'No' or 'NextCycle', every signal is matter and count without debounced (every changes dispatched).
   *
   * tips: debounce work like throttle this means listeners call with latest dispatch value.
   *
   * @default `AnimationFrame`
   */
  debounce: DebounceType;
}

/**
 * dispatchSignal options type
 */
export interface ContextSignalDispatchOptions extends DispatchOptions {
  replaceAll: boolean;
}


/**
 * Subscribe callback function.
 */
export type ListenerFunction = (event: CustomEvent) => void | Promise<void>;

/**
 * Signal listeners object in storage.
 */
export type ListenerObject = ListenerSpec & {
  /**
   * If true, the listener will be called only once and removed automatically after first call
   */
  once: boolean;

  callback: ListenerFunction;
};

/**
 * Signal object in storage.
 */
export interface SignalObject {
  /**
   * Signal id for direct access.
   */
  id: string;

  /**
   * If true, the signal is disabled.
   */
  disabled: boolean;

  /**
   * Dispatches debounced (delayed).
   * Internal use case for debounce dispatch signal.
   */
  debounced: boolean;

  /**
   * Signal listeners list.
   */
  listenerList: ListenerObject[];
}

/**
 * Signal object in storage.
 */
export interface ContextSignalObject<T> extends SignalObject {
  /**
   * Last dispatched detail.
   */
  detail?: T;
}

/**
 * Signal stack storage.
 */
export type SignalStorage = Record<string, ContextSignalObject<Stringifyable> | undefined>;

/**
 * Listener spec.
 */
export interface ListenerSpec {
  /**
   * Unique listener id
   */
  id: number;

  /**
   * Signal id
   */
  signalId: string;
}