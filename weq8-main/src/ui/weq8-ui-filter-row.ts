import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { WEQ8Runtime } from "../runtime";
import { FilterType } from "../spec";
import {
  clamp,
  filterHasFrequency,
  filterHasGain,
  filterHasQ,
  formatFrequency,
  formatFrequencyUnit,
  toLin,
  toLog10,
} from "../functions";
import { sharedStyles } from "./styles";
import { TYPE_OPTIONS } from "./constants";

type DragState = {
  pointer: number;
  startY: number;
  startValue: number;
};

@customElement("weq8-ui-filter-row")
export class EQUIFilterRowElement extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 60px 60px 50px 40px;
        align-items: center;
        gap: 4px;
        background-color: transparent;
        border-radius: 8px;
        transition: background-color 0.15s ease;
        padding: 4px 0;
      }
      :host(.selected) {
        background-color: rgba(255, 255, 255, 0.05);
      }
      input,
      select {
        padding: 0;
        border: 0;
        font-family: inherit;
        color: inherit;
        background: transparent;
      }
      input {
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
        border-radius: 4px;
        padding: 2px 4px;
        text-align: right;
      }
      input:focus,
      input:active {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: var(--weq8-accent-solid);
        outline: none;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 4px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
      }
      .chip:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.1);
      }
      :host(.selected) .chip .filterNumber {
        background: var(--weq8-accent);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      .chip.disabled {
        opacity: 0.5;
        background: transparent;
        border-color: transparent;
      }
      .filterNumber {
        cursor: pointer;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: grid;
        place-content: center;
        background: var(--weq8-text);
        font-size: 10px;
        font-weight: 700;
        color: black;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .chip.disabled .filterNumber {
        background: rgba(255, 255, 255, 0.1);
        color: var(--weq8-text-dim);
      }
      .chip.bypassed .filterNumber {
        background: var(--weq8-text-dim);
        color: rgba(0, 0, 0, 0.5);
      }
      .filterTypeSelect {
        width: 32px;
        appearance: none;
        outline: none;
        background-color: transparent;
        color: var(--weq8-text);
        cursor: pointer;
        text-align: center;
        font-size: 10px;
        font-weight: 600;
        border-radius: 4px;
      }
      .filterTypeSelect:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .filterTypeSelect.bypassed {
        color: var(--weq8-text-dim);
      }
      .frequencyInput {
        width: 40px;
      }
      .gainInput {
        width: 32px;
      }
      .qInput {
        width: 36px;
      }
      .numberInput {
        appearance: none;
        -moz-appearance: textfield;
        font-variant-numeric: tabular-nums;
        font-size: 11px;
      }
      .numberInput:disabled,
      .disabled {
        color: var(--weq8-text-dim);
        pointer-events: none;
      }
      .bypassed {
        color: var(--weq8-text-dim);
      }
      .numberInput::-webkit-inner-spin-button,
      .numberInput::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
      }
    `,
  ];

  constructor() {
    super();
    this.addEventListener("click", () =>
      this.dispatchEvent(
        new CustomEvent("select", { composed: true, bubbles: true })
      )
    );
  }

  @property({ attribute: false })
  runtime?: WEQ8Runtime;

  @property()
  index?: number;

  @state()
  private frequencyInputFocused = false;

  @state()
  private dragStates: {
    frequency: DragState | null;
    gain: DragState | null;
    Q: DragState | null;
  } = { frequency: null, gain: null, Q: null };

  render() {
    if (!this.runtime || this.index === undefined) return;

    let typeOptions = TYPE_OPTIONS.filter((o) =>
      this.runtime!.supportedFilterTypes.includes(o[0] as FilterType)
    );

    let spec = this.runtime.spec[this.index];
    return html`
      <th>
        <div
          class=${classMap({
            chip: true,
            disabled: !filterHasFrequency(spec.type),
            bypassed: spec.bypass,
          })}
        >
          <div
            class=${classMap({
              filterNumber: true,
              bypassed: spec.bypass,
            })}
            @click=${() => this.toggleBypass()}
          >
            ${this.index + 1}
          </div>
          <select
            class=${classMap({ filterTypeSelect: true, bypassed: spec.bypass })}
            @change=${(evt: { target: HTMLSelectElement }) =>
              this.setFilterType(evt.target.value as FilterType | "noop")}
          >
            ${typeOptions.map(
              ([type, label]) =>
                html`<option value=${type} ?selected=${spec.type === type}>
                  ${label}
                </option>`
            )}
          </select>
        </div>
      </th>
      <td>
        <input
          class=${classMap({
            frequencyInput: true,
            numberInput: true,
            bypassed: spec.bypass,
          })}
          type="number"
          step="0.1"
          lang="en_EN"
          .value=${formatFrequency(spec.frequency, this.frequencyInputFocused)}
          ?disabled=${!filterHasFrequency(spec.type)}
          @focus=${() => (this.frequencyInputFocused = true)}
          @blur=${() => {
            this.frequencyInputFocused = false;
            this.setFilterFrequency(clamp(spec.frequency, 10, this.nyquist));
          }}
          @input=${(evt: { target: HTMLInputElement }) =>
            this.setFilterFrequency(evt.target.valueAsNumber)}
          @pointerdown=${(evt: PointerEvent) =>
            this.startDraggingValue(evt, "frequency")}
          @pointerup=${(evt: PointerEvent) =>
            this.stopDraggingValue(evt, "frequency")}
          @pointermove=${(evt: PointerEvent) =>
            this.dragValue(evt, "frequency")}
        />
        <span
          class=${classMap({
            frequencyUnit: true,
            disabled: !filterHasFrequency(spec.type),
            bypassed: spec.bypass,
          })}
          >${formatFrequencyUnit(
            spec.frequency,
            this.frequencyInputFocused
          )}</span
        >
      </td>
      <td>
        <input
          class=${classMap({
            gainInput: true,
            numberInput: true,
            bypassed: spec.bypass,
          })}
          type="number"
          min="-15"
          max="15"
          step="0.1"
          lang="en_EN"
          .value=${spec.gain.toFixed(1)}
          ?disabled=${!filterHasGain(spec.type)}
          @input=${(evt: { target: HTMLInputElement }) =>
            this.setFilterGain(evt.target.valueAsNumber)}
          @pointerdown=${(evt: PointerEvent) =>
            this.startDraggingValue(evt, "gain")}
          @pointerup=${(evt: PointerEvent) =>
            this.stopDraggingValue(evt, "gain")}
          @pointermove=${(evt: PointerEvent) => this.dragValue(evt, "gain")}
        />
        <span
          class=${classMap({
            gainUnit: true,
            disabled: !filterHasGain(spec.type),
            bypassed: spec.bypass,
          })}
          >dB</span
        >
      </td>
      <td>
        <input
          class=${classMap({
            qInput: true,
            numberInput: true,
            bypassed: spec.bypass,
          })}
          type="number"
          min="0.1"
          max="18"
          step="0.1"
          .value=${spec.Q.toFixed(2)}
          ?disabled=${!filterHasQ(spec.type)}
          @input=${(evt: { target: HTMLInputElement }) =>
            this.setFilterQ(evt.target.valueAsNumber)}
          @pointerdown=${(evt: PointerEvent) =>
            this.startDraggingValue(evt, "Q")}
          @pointerup=${(evt: PointerEvent) => this.stopDraggingValue(evt, "Q")}
          @pointermove=${(evt: PointerEvent) => this.dragValue(evt, "Q")}
        />
      </td>
    `;
  }

  private get nyquist() {
    return (this.runtime?.audioCtx.sampleRate ?? 48000) / 2;
  }

  private toggleBypass() {
    if (!this.runtime || this.index === undefined) return;
    this.runtime.toggleBypass(
      this.index,
      !this.runtime.spec[this.index].bypass
    );
  }

  private setFilterType(type: FilterType | "noop") {
    if (!this.runtime || this.index === undefined) return;
    this.runtime.setFilterType(this.index, type);
  }

  private setFilterFrequency(frequency: number) {
    if (!this.runtime || this.index === undefined) return;
    if (!isNaN(frequency)) {
      this.runtime.setFilterFrequency(this.index, frequency);
    }
  }

  private setFilterGain(gain: number) {
    if (!this.runtime || this.index === undefined) return;
    if (!isNaN(gain)) {
      this.runtime.setFilterGain(this.index, gain);
    }
  }

  private setFilterQ(Q: number) {
    if (!this.runtime || this.index === undefined) return;
    if (!isNaN(Q)) {
      this.runtime.setFilterQ(this.index, Q);
    }
  }

  private startDraggingValue(
    evt: PointerEvent,
    property: "frequency" | "gain" | "Q"
  ) {
    if (!this.runtime || this.index === undefined) return;

    (evt.target as Element).setPointerCapture(evt.pointerId);
    this.dragStates = {
      ...this.dragStates,
      [property]: {
        pointer: evt.pointerId,
        startY: evt.clientY,
        startValue: this.runtime.spec[this.index][property],
      },
    };
  }

  private stopDraggingValue(
    evt: PointerEvent,
    property: "frequency" | "gain" | "Q"
  ) {
    if (!this.runtime || this.index === undefined) return;

    if (this.dragStates[property]?.pointer === evt.pointerId) {
      (evt.target as Element).releasePointerCapture(evt.pointerId);
      this.dragStates = { ...this.dragStates, [property]: null };
    }
  }

  private dragValue(evt: PointerEvent, property: "frequency" | "gain" | "Q") {
    if (!this.runtime || this.index === undefined) return;
    let dragState = this.dragStates[property];
    if (dragState && dragState.pointer === evt.pointerId) {
      let startY = dragState.startY;
      let currentY = evt.clientY;
      let yDelta = -(currentY - startY);
      let relYDelta = clamp(yDelta / 150, -1, 1);
      if (property === "frequency") {
        let minFreq = 10;
        let maxFreq = this.runtime.audioCtx.sampleRate / 2;
        let startFreqLog = toLog10(dragState.startValue, minFreq, maxFreq);
        let newFreq = toLin(startFreqLog + relYDelta, minFreq, maxFreq);
        this.runtime.setFilterFrequency(this.index, newFreq);
      } else if (property === "gain") {
        let gainDelta = relYDelta * 15;
        this.runtime.setFilterGain(
          this.index,
          clamp(dragState.startValue + gainDelta, -15, 15)
        );
      } else if (property === "Q") {
        let minQ = 0.1;
        let maxQ = 18;
        let startQLog = toLog10(dragState.startValue, minQ, maxQ);
        let newQ = toLin(startQLog + relYDelta, minQ, maxQ);
        this.runtime.setFilterQ(this.index, newQ);
      }
      (evt.target as HTMLInputElement).blur();
    }
  }
}
