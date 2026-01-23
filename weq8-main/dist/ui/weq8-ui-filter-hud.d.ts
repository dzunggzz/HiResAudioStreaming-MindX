import { LitElement } from "lit";
import { WEQ8Runtime } from "../runtime";
export declare class EQUIFilterHUDElement extends LitElement {
    static styles: import("lit").CSSResult[];
    runtime?: WEQ8Runtime;
    index?: number;
    x?: number;
    y?: number;
    private frequencyInputFocused;
    private dragStates;
    private posOnDragStart;
    render(): import("lit-html").TemplateResult<1> | undefined;
    private get nyquist();
    private setFilterType;
    private setFilterFrequency;
    private setFilterGain;
    private setFilterQ;
    private startDraggingValue;
    private stopDraggingValue;
    private dragValue;
}
