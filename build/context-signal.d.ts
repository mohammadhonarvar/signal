import type { ContextSignalDispatchOptions, ContextSignalObject } from './type.js';
/**
 *
 * Example:
 *
 * ```ts
 * setContextSignalValue<ContentType>('content-change', { key: 5 });
 * ```
 */
export declare const setContextSignalValue: <T>(signalId: keyof T, value: T[keyof T], replaceAll?: boolean) => ContextSignalObject<T>;
/**
 * Get current signal detail/value.
 *
 * Example:
 *
 * ```ts
 * const currentContent = getContextSignalValue<ContentType>('content-change');
 * ```
 */
export declare const getContextSignalValue: <T>(signalId: keyof T) => T | undefined;
export declare function contextDispatch<T>(signalId: keyof T, value: T[typeof signalId], options?: Partial<ContextSignalDispatchOptions>): void;
export declare function onContextDispatch<T>(signalId: keyof T, callback: (detail: T[typeof signalId]) => void | Promise<void>, options?: {
    preserved?: boolean;
    runAsLatest?: boolean;
    once?: boolean;
}): number;
export declare function removeOnContextDispatch<T>(signalId: keyof T, listenerId: number): void;
/**
 * A function to trigger actions that we need, it's async
 * @function firstContextDispatch
 * @returns {Promise<void>} promise of void
 */
export declare function firstContextDispatch<T>(signalId: keyof T, conditionFn?: (detail: ContextSignalObject<T>['detail']) => boolean): Promise<void>;
//# sourceMappingURL=context-signal.d.ts.map