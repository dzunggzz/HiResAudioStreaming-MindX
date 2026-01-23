import { LitElement } from "lit";
import { WEQ8Runtime } from "../runtime";
import "./weq8-ui-filter-row";
import "./weq8-ui-filter-hud";
export declare class WEQ8UIElement extends LitElement {
    static styles: import("lit").CSSResult[];
    constructor();
    runtime?: WEQ8Runtime;
    view: "hud" | "allBands";
    private analyser?;
    private frequencyResponse?;
    private gridXs;
    private dragStates;
    private selectedFilterIdx;
    private analyserCanvas?;
    private frequencyResponseCanvas?;
    updated(changedProperties: Map<string, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
    private renderTable;
    private renderFilterHUD;
    private renderGridX;
    private renderGridY;
    private renderFilterHandle;
    private getFilterPositionInVisualisation;
    private startDraggingFilterHandle;
    private stopDraggingFilterHandle;
    private dragFilterHandle;
}
