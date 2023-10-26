export type SearchParam = Record<string, string | string[]>;

export function firstSearchParam(params: string | string[] | undefined) {
  return Array.isArray(params) ? params[0] : params;
}
