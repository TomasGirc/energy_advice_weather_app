// Returns a linear regression (trend line) for the input array
export function trendLine(data: number[]): number[] {
  const n = data.length;
  if (n === 0) return [];
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * data[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return x.map((xi) => Number((slope * xi + intercept).toFixed(2)));
}
