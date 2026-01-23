import { WEQ8Runtime } from "../runtime";
export declare class WEQ8FrequencyResponse {
    private runtime;
    private canvas;
    private frequencies;
    private filterMagResponse;
    private filterPhaseResponse;
    private frequencyResponse;
    private resizeObserver;
    constructor(runtime: WEQ8Runtime, canvas: HTMLCanvasElement);
    dispose(): void;
    render(): void;
    private draw;
    private calculateFrequencies;
}
