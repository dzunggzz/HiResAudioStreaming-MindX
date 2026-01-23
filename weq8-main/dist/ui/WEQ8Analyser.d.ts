import { WEQ8Runtime } from "../runtime";
export declare class WEQ8Analyser {
    private runtime;
    private canvas;
    private analyser;
    private analysisData;
    private analysisXs;
    private disposed;
    private resizeObserver;
    constructor(runtime: WEQ8Runtime, canvas: HTMLCanvasElement);
    private calculateAnalysisXs;
    analyse(): void;
    private draw;
    dispose(): void;
}
