const BYTE_UNITS = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
];
const BIBYTE_UNITS = [
  "B",
  "kiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
];
const BIT_UNITS = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
];
const BIBIT_UNITS = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
];
const toLocaleString = (number, locale, options) => {
  let result = number;
  if (typeof locale === "string" || Array.isArray(locale)) {
    result = number.toLocaleString(locale, options);
  } else if (locale === true || options !== void 0) {
    result = number.toLocaleString(void 0, options);
  }
  return result;
};
function prettyBytes(number, options) {
  if (!Number.isFinite(number)) {
    throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
  }
  options = {
    bits: false,
    binary: false,
    ...options
  };
  const UNITS = options.bits ? options.binary ? BIBIT_UNITS : BIT_UNITS : options.binary ? BIBYTE_UNITS : BYTE_UNITS;
  if (options.signed && number === 0) {
    return ` 0 ${UNITS[0]}`;
  }
  const isNegative = number < 0;
  const prefix = isNegative ? "-" : options.signed ? "+" : "";
  if (isNegative) {
    number = -number;
  }
  let localeOptions;
  if (options.minimumFractionDigits !== void 0) {
    localeOptions = {minimumFractionDigits: options.minimumFractionDigits};
  }
  if (options.maximumFractionDigits !== void 0) {
    localeOptions = {maximumFractionDigits: options.maximumFractionDigits, ...localeOptions};
  }
  if (number < 1) {
    const numberString2 = toLocaleString(number, options.locale, localeOptions);
    return prefix + numberString2 + " " + UNITS[0];
  }
  const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
  number /= (options.binary ? 1024 : 1e3) ** exponent;
  if (!localeOptions) {
    number = number.toPrecision(3);
  }
  const numberString = toLocaleString(Number(number), options.locale, localeOptions);
  const unit = UNITS[exponent];
  return prefix + numberString + " " + unit;
}
export default prettyBytes;
