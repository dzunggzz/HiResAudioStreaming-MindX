function o(s) {
  return s === "lowshelf12" || s === "lowshelf24" || s === "highshelf12" || s === "highshelf24" || s === "peaking12" || s === "peaking24";
}
function t(s) {
  return s !== "noop";
}
function r(s) {
  return s === "lowpass12" || s === "lowpass24" || s === "highpass12" || s === "highpass24" || s === "bandpass12" || s === "bandpass24" || s === "peaking12" || s === "peaking24" || s === "notch12" || s === "notch24";
}
function i(s) {
  switch (s) {
    case "lowpass12":
    case "lowpass24":
      return "lowpass";
    case "highpass12":
    case "highpass24":
      return "highpass";
    case "bandpass12":
    case "bandpass24":
      return "bandpass";
    case "lowshelf12":
    case "lowshelf24":
      return "lowshelf";
    case "highshelf12":
    case "highshelf24":
      return "highshelf";
    case "peaking12":
    case "peaking24":
      return "peaking";
    case "notch12":
    case "notch24":
      return "notch";
  }
}
function l(s) {
  switch (s) {
    case "noop":
      return 0;
    case "lowpass12":
    case "highpass12":
    case "bandpass12":
    case "lowshelf12":
    case "highshelf12":
    case "peaking12":
    case "notch12":
      return 1;
    case "lowpass24":
    case "highpass24":
    case "bandpass24":
    case "lowshelf24":
    case "highshelf24":
    case "peaking24":
    case "notch24":
      return 2;
  }
}
function g(s, a, e) {
  let n = Math.log10(a), h = Math.log10(e);
  return (Math.log10(c(s, a, e)) - n) / (h - n);
}
function u(s, a, e) {
  let n = Math.log10(a), h = Math.log10(e);
  return c(Math.pow(10, s * (h - n) + n), a, e);
}
function c(s, a, e) {
  return Math.min(Math.max(s, a), e);
}
function f(s, a = !1) {
  return s >= 1e3 && !a ? (s / 1e3).toFixed(2) : s.toFixed(0);
}
function p(s, a = !1) {
  return s >= 1e3 && !a ? "kHz" : "Hz";
}
export {
  l as a,
  f as b,
  c,
  p as d,
  o as e,
  t as f,
  i as g,
  r as h,
  u as i,
  g as t
};
