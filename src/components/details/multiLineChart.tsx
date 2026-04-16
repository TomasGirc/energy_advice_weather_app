import type { MultiLineChartProps } from "@/lib/types";
import React from "react";
import { Line } from "react-chartjs-2";

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  labels,
  datasets,
  title,
}) => {
  return (
    <div style={{ maxWidth: 900 }}>
      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            title: {
              display: !!title,
              text: title,
              align: "start",
              font: { size: 18, weight: "bold" },
              padding: { bottom: 8 },
            },
            tooltip: { enabled: true },
          },
          scales: {
            x: { title: { display: true, text: "Time" } },
            y: { title: { display: true, text: title || "Value" } },
          },
        }}
      />
    </div>
  );
};

export default MultiLineChart;
