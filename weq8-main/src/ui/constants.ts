import { FilterType } from "src/spec";

export const TYPE_OPTIONS: [FilterType | "noop", string][] = [
  ["noop", "Add +"],
  ["peaking12", "Bell 12dB"],
  ["peaking24", "Bell 24dB"],
  ["lowshelf12", "Low Shelf 12dB"],
  ["lowshelf24", "Low Shelf 24dB"],
  ["highshelf12", "High Shelf 12dB"],
  ["highshelf24", "High Shelf 24dB"],
  ["highpass12", "Low Cut 12dB"],
  ["highpass24", "Low Cut 24dB"],
  ["lowpass12", "High Cut 12dB"],
  ["lowpass24", "High Cut 24dB"],
  ["notch12", "Notch 12dB"],
  ["notch24", "Notch 24dB"],
  ["bandpass12", "Band Pass 12dB"],
  ["bandpass24", "Band Pass 24dB"],
  ["allpass12", "All Pass 12dB"],
  ["allpass24", "All Pass 24dB"],
];
