export type WEQ8Spec = [
    WEQ8Filter,
    WEQ8Filter,
    WEQ8Filter,
    WEQ8Filter,
    WEQ8Filter,
    WEQ8Filter,
    WEQ8Filter,
    WEQ8Filter
];
export type FilterType = "lowpass12" | "lowpass24" | "highpass12" | "highpass24" | "bandpass12" | "bandpass24" | "lowshelf12" | "lowshelf24" | "highshelf12" | "highshelf24" | "peaking12" | "peaking24" | "notch12" | "notch24";
export declare const FILTER_TYPES: FilterType[];
export type WEQ8Filter = {
    type: FilterType | "noop";
    frequency: number;
    Q: number;
    gain: number;
    bypass: boolean;
};
export declare const DEFAULT_SPEC: WEQ8Spec;
