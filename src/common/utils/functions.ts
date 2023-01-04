export const toSlug = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const calcTax = (totalCost: number): number => {
  const percent = totalCost / 100;

  return percent * 3;
};
