export const EQ_PRESETS = {
  "flat": [
    { type: "lowshelf12", frequency: 30, gain: 0, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 200, gain: 0, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 1000, gain: 0, Q: 0.7, bypass: false },
    { type: "highshelf12", frequency: 5000, gain: 0, Q: 0.7, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false }
  ],
  "bass-boost": [
    { type: "lowshelf12", frequency: 100, gain: 8, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 200, gain: 3, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 1000, gain: 0, Q: 0.7, bypass: false },
    { type: "highshelf12", frequency: 5000, gain: -2, Q: 0.7, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false }
  ],
  "bass-reduce": [
    { type: "lowshelf12", frequency: 100, gain: -6, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 200, gain: -3, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 1000, gain: 0, Q: 0.7, bypass: false },
    { type: "highshelf12", frequency: 5000, gain: 0, Q: 0.7, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false }
  ],
  "vocals": [
    { type: "highpass12", frequency: 94.348, gain: 0, Q: 1.049, bypass: false },
    { type: "peaking12", frequency: 197.99, gain: 2.7, Q: 0.525, bypass: false },
    { type: "peaking12", frequency: 424.56, gain: -0.27, Q: 2.233, bypass: false },
    { type: "peaking12", frequency: 528.21, gain: -2.84, Q: 0.391, bypass: false },
    { type: "peaking12", frequency: 645.03, gain: -0.58, Q: 6.581, bypass: false },
    { type: "peaking12", frequency: 1283.4, gain: -0.73, Q: 2.180, bypass: false },
    { type: "peaking12", frequency: 3535.9, gain: 2.59, Q: 0.569, bypass: false },
    { type: "peaking12", frequency: 9241.4, gain: -2, Q: 1.247, bypass: false },
    { type: "peaking12", frequency: 15694, gain: 5.91, Q: 0.522, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
  ],
  "treble-boost": [
    { type: "lowshelf12", frequency: 100, gain: 0, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 200, gain: 0, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 1000, gain: 0, Q: 0.7, bypass: false },
    { type: "highshelf12", frequency: 5000, gain: 6, Q: 0.7, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false }
  ],
  "electronic": [
    { type: "lowshelf12", frequency: 60, gain: 4, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 250, gain: 1, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 1000, gain: -1, Q: 0.7, bypass: false },
    { type: "highshelf12", frequency: 8000, gain: 3, Q: 0.7, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false }
  ],
  "acoustic": [
    { type: "lowshelf12", frequency: 100, gain: 2, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 400, gain: 1, Q: 0.7, bypass: false },
    { type: "peaking12", frequency: 2000, gain: 2, Q: 0.7, bypass: false },
    { type: "highshelf12", frequency: 6000, gain: 3, Q: 0.7, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false },
    { type: "noop", frequency: 350, gain: 0, Q: 1, bypass: false }
  ]
};

export function applyPreset(weq8Instance, presetName) {
  const preset = EQ_PRESETS[presetName];
  if (!preset || !weq8Instance) return;

  preset.forEach((filterSpec, index) => {
    weq8Instance.setFilterType(index, filterSpec.type);
    
    weq8Instance.setFilterFrequency(index, filterSpec.frequency);

    weq8Instance.setFilterQ(index, filterSpec.Q);

    weq8Instance.setFilterGain(index, filterSpec.gain);

    weq8Instance.toggleBypass(index, filterSpec.bypass);
  });
}
