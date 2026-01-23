import { LitElement } from "lit";
import { WEQ8Runtime } from "../runtime";
export declare class EQUIFilterRowElement extends LitElement {
    static styles: import("lit").CSSResult[];
    constructor();
    runtime?: WEQ8Runtime;
    index?: number;
    private frequencyInputFocused;
    private dragStates;
    render(): import("lit-html").TemplateResult<1> | undefined;
    private get nyquist();
    private toggleBypass;
    private setFilterType;
    private setFilterFrequency;
    private setFilterGain;
    private setFilterQ;
    private startDraggingValue;
    private stopDraggingValue;
    private dragValue;
}
