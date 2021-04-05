export function getItem<T>(key: string): T | null {
  console.log(`get ${key}`);
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) || null : null;
}
export function setItem<T>(key: string, value: T): void {
  console.log(`recorded ${key} with ${value}`);
  localStorage.setItem(key, JSON.stringify(value));
}
export function removeItem(key: string): void {
  console.log(`removed ${key}`);
}
