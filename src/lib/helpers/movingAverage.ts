export function movingAverage(data: number[], windowSize: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const avg = window.reduce((sum, v) => sum + v, 0) / window.length;
      result.push(Number(avg.toFixed(2)));
    }
    return result;
  }