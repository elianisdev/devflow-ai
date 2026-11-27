export const formatMessage = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(values[key] ?? placeholder));

export const formatCount = (count: number, oneTemplate: string, manyTemplate: string) =>
  formatMessage(count === 1 ? oneTemplate : manyTemplate, { count });
