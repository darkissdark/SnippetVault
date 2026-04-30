export const toPositiveNumber = (
  value: string | null,
  fallback: number,
): number => {
  if (!value) return fallback;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 1) return fallback;
  return Math.floor(numberValue);
};

export const normalizeTag = (value: string): string =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(', ');

const pickFirstValue = (
  value: string | string[] | null | undefined,
): string | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

export const getSearchParamString = (
  value: string | string[] | null | undefined,
): string => pickFirstValue(value)?.trim() ?? '';

export const getSearchParamPositiveNumber = (
  value: string | string[] | null | undefined,
  fallback: number,
): number => toPositiveNumber(pickFirstValue(value), fallback);
