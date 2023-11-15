import type { SignalStorage } from './type.js';
export declare const debounceTimeout = 5;
/**
 * Signal stack database.
 */
export declare const _signalStorage: SignalStorage;
export declare const _actionTarget: EventTarget | Element;
export declare function removeSignal(signalId: keyof typeof _signalStorage, prune?: boolean): void;
/**
 * A function to empty signal object
 * @function resetSignalObject
 * @returns {void} void
 */
export declare function resetSignalObject(): void;
//# sourceMappingURL=common.d.ts.map