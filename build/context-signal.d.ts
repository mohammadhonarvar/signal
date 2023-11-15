import type { ContextSignalDispatchOptions, ContextSignalObject } from './type.js';
/**
 *
 * Example:
 *
 * ```ts
 * setContextSignalValue<ContentType>('content-change', { key: 5 });
 * ```
 */
export declare const setContextSignalValue: <T extends object>() => <K extends keyof T = keyof T>(signalId: K, value: Partial<T[K]>, replaceAll?: boolean) => ContextSignalObject<T[K]>;
/**
 * Get current signal detail/value.
 *
 * Example:
 *
 * ```ts
 * const currentContent = getContextSignalValue<ContentType>('content-change');
 * ```
 */
export declare const getContextSignalValue: <T extends object>() => <K extends keyof T = keyof T>(signalId: K) => T[K] | undefined;
export declare function contextDispatch<T extends object>(): <K extends keyof T = keyof T>(signalId: K, value: T[K], options?: Partial<ContextSignalDispatchOptions>) => void;
export declare function contextEditionDispatch<T extends object>(): <K extends keyof T = keyof T>(signalId: K, value: Partial<T[K]>, options?: Partial<ContextSignalDispatchOptions>) => void;
export declare function onContextDispatch<T extends object>(): <K extends keyof T = keyof T>(signalId: K, callback: (detail: T[K]) => void | Promise<void>, options?: {
    preserved?: boolean;
    runAsLatest?: boolean;
    once?: boolean;
}) => number;
export declare function removeOnContextDispatch<T extends object>(): <K extends keyof T = keyof T>(signalId: K, listenerId: number) => void;
/**
 * A function to trigger actions that we need, it's async
 * @function firstContextDispatch
 * @returns {Promise<void>} promise of void
 */
export declare function firstContextDispatch<T extends object>(): <K extends keyof T = keyof T>(signalId: K, conditionFn?: ((detail: T[K] | undefined) => boolean) | undefined) => Promise<void>;
//# sourceMappingURL=context-signal.d.ts.map