export function requireFields(body: any, fields: string[]) {
  const missing = fields.filter((f) => body?.[f] === undefined);
  return missing;
}

export function isEmptyObject(obj: any) {
  return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);
}

