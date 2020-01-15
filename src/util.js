export const kebabCase = str =>
  str.replace(/[A-Z]/g, (a, b) => `-${a.toLowerCase()}`);

export const firstDefined = (...opts) => {
  if (opts.length === 1) {
    return opts[0];
  } else {
    return opts[0] !== undefined && opts[0] !== null
      ? opts[0]
      : firstDefined(...opts.slice(1));
  }
};
