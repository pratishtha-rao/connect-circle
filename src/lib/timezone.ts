export const timezones = Intl.supportedValuesOf("timeZone").map((tz) => ({
  value: tz,
  label: tz.replaceAll("_", " "),
}));