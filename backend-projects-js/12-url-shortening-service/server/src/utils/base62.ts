const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const encodeBase62 = (num: number): string => {
  if (num === 0) return CHARS[0];

  let encoded = "";
  let current = num;

  while (current > 0) {
    const remainder = current % 62;
    encoded = CHARS[remainder] + encoded;
    current = Math.floor(current / 62);
  }

  return encoded;
};
