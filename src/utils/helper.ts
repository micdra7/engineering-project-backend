export const isEmptyObject = (obj: unknown): boolean =>
  !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
