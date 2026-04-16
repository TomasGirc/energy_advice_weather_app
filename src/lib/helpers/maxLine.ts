// Returns an array with the maximum value of the input array repeated for its length
export function maxLine(data: number[]): number[] {
  const max = Math.max(...data);
  return Array(data.length).fill(max);
}
