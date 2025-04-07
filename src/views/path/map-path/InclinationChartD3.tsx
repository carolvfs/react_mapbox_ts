import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import zIndex from '@mui/material/styles/zIndex';

interface InclinationChartD3Props {
  inclinations: number[];
}

const InclinationChartD3: React.FC<InclinationChartD3Props> = ({ inclinations }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Remove any existing content from the SVG.
    d3.select(svgRef.current).selectAll("*").remove();

    // Set chart dimensions and margins.
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    // Create the SVG container.
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create x-scale: using the index of each data point.
    const xScale = d3
      .scaleLinear()
      .domain([0, inclinations.length - 1])
      .range([0, width]);

    // Create y-scale based on the minimum and maximum inclination values.
    const yMin = d3.min(inclinations) ?? 0;
    const yMax = d3.max(inclinations) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      // .call(d3.axisBottom(xScale).ticks(inclinations.length).tickFormat((d, i) => `Pt ${i + 1}`));
      .call(d3.axisBottom(xScale))//.ticks(inclinations.length).tickFormat((d, i) => `Pt ${i + 1}`));

    // Add the y-axis.
    svg.append("g").call(d3.axisLeft(yScale));

    // Create a line generator.
    const lineGenerator = d3
      .line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    // Append the line path.
    svg
      .append("path")
      .datum(inclinations)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // Optionally, add circles for each data point.
    svg
      .selectAll("circle")
      .data(inclinations)
      .enter()
      .append("circle")
      .attr("cx", (_, i) => xScale(i))
      .attr("cy", d => yScale(d))
      .attr("r", 3)
      .attr("fill", "red");
  }, [inclinations]);

  return (
    <div style={{ position: "absolute", top: 10, left: 0, zIndex:1000, width: "1000px", height: "250px", margin: "20px auto" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default InclinationChartD3;
