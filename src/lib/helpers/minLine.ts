// Returns an array with the minimum value of the input array repeated for its length
export function minLine(data: number[]): number[] {
  const min = Math.min(...data);
  return Array(data.length).fill(min);
}
