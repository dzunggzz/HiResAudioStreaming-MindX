import { Unsubscribe } from "nanoevents";
import { WEQ8Spec, FilterType } from "./spec";
interface WEQ8Events {
    filtersChanged: (spec: WEQ8Spec) => void;
}
export declare class WEQ8Runtime {
    readonly audioCtx: BaseAudioContext;
    readonly spec: WEQ8Spec;
    readonly supportedFilterTypes: FilterType[];
    readonly input: AudioNode;
    private readonly output;
    private filterbank;
    private readonly emitter;
    constructor(audioCtx: BaseAudioContext, spec?: WEQ8Spec, supportedFilterTypes?: FilterType[]);
    connect(node: AudioNode): void;
    disconnect(node: AudioNode): void;
    on<E extends keyof WEQ8Events>(event: E, callback: WEQ8Events[E]): Unsubscribe;
    setFilterType(idx: number, type: FilterType | "noop"): void;
    toggleBypass(idx: number, bypass: boolean): void;
    private disconnectFilter;
    private connectFilter;
    setFilterFrequency(idx: number, frequency: number): void;
    setFilterQ(idx: number, Q: number): void;
    setFilterGain(idx: number, gain: number): void;
    getFrequencyResponse(idx: number, filterIdx: number, frequencies: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): boolean;
    private buildFilterChain;
    private getPreviousInChain;
    private getNextInChain;
}
export {};
