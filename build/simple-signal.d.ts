import type { DispatchOptions } from './type.js';
export declare function dispatch<T>(signalId: T, options?: Partial<DispatchOptions>): void;
export declare function onDispatch<T>(signalId: T, callback: () => void | Promise<void>, options?: {
    preserved?: boolean;
    runAsLatest?: boolean;
    once?: boolean;
}): number;
export declare function removeOnDispatch<T>(signalId: T, listenerId: number): void;
/**
 * A function to trigger actions that we need, it's async
 * @function firstContextDispatch
 * @returns {Promise<void>} promise of void
 */
export declare function firstDispatch<T>(signalId: T): Promise<void>;
//# sourceMappingURL=simple-signal.d.ts.map