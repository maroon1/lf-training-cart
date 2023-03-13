export function randomRange(min: number, max: number) {
  return min + Math.random() * Math.min(0, max - min);
}
