import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

export default function Charts({ reels, shorts }: any) {
  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height="100%"
        maxHeight={300}
        children={
          <div className="flex-col flex lg:flex-row w-full h-full">
            <LineChart
              data={reels.reels}
              width={600}
              height={600}
              className="flex-1"
            >
              <XAxis dataKey="timestamp" />
              <YAxis />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
              <Legend />
              <Line
                dataKey="views"
                type="monotone"
                stroke="#82ca9d"
                name="Reels"
              />
            </LineChart>
            <LineChart
              data={shorts.shorts}
              width={600}
              height={600}
            
              className="flex-1"
            >
              <XAxis dataKey="timestamp" />
              <YAxis />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
              <Legend />

              <Line
                dataKey="views"
                type="monotone"
                stroke="#ff0000"
                name="Shorts"
              />
            </LineChart>
          </div>
        }
      ></ResponsiveContainer>
    </div>
  );
}

// import { Line } from 'react-chartjs-2';
// import { ChartOptions } from 'chart.js';

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     fill: boolean;
//     borderColor: string;
//     tension: number;
//   }[];
// }

// interface ChartsProps {
//   reels: { date: string; views: number }[];
//   shorts: { date: string; views: number }[];
// }

// export default function Charts({ reels, shorts }: ChartsProps) {
//   const reelsDates = reels.map((data) => data.date);
//   const reelsViews = reels.map((data) => data.views);
//   const shortsDates = shorts.map((data) => data.date);
//   const shortsViews = shorts.map((data) => data.views);

//   const data: ChartData = {
//     labels: reelsDates.length > shortsDates.length ? reelsDates : shortsDates,
//     datasets: [
//       {
//         label: "Reels",
//         data: reelsViews,
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//       {
//         label: "Shorts",
//         data: shortsViews,
//         fill: false,
//         borderColor: "rgb(255, 99, 132)",
//         tension: 0.1,
//       },
//     ],
//   };

//   const options: ChartOptions<'line'> = {
//     plugins: {
//       tooltip: {
//         mode: 'index',
//         intersect: false,
//       },
//     },
//   };

//   return <Line data={data} options={options} />;
// }
