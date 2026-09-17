import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ScatterData {
  category: string;
  accuracy: number;
  averageTimeMs: number;
}

interface Props {
  data: ScatterData[];
}

export const D3SpeedAccuracyChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const chart = svg
      .attr("viewBox", `0 0 600 400`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Axis: Average Time (Seconds)
    const xMax = d3.max(data, (d: ScatterData) => d.averageTimeMs / 1000) || 60;
    const x = d3.scaleLinear()
      .domain([0, xMax * 1.1])
      .range([0, width]);

    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "12px");

    // X Axis Label
    chart.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Average Time per Question (Seconds)")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .attr("fill", "#64748b");

    // Y Axis: Accuracy (%)
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    chart.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "12px");

    // Y Axis Label
    chart.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -height / 2)
      .text("Accuracy (%)")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .attr("fill", "#64748b");

    // Grid lines (horizontal & vertical)
    chart.append("g")
      .attr("class", "grid")
      .attr("color", "#f1f5f9")
      .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3");

    chart.append("g")
      .attr("class", "grid")
      .attr("color", "#f1f5f9")
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3");

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #e2e8f0")
      .style("border-radius", "8px")
      .style("padding", "8px 12px")
      .style("box-shadow", "0 4px 6px -1px rgb(0 0 0 / 0.1)")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Dots
    chart.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: ScatterData) => x(d.averageTimeMs / 1000))
      .attr("cy", (d: ScatterData) => y(d.accuracy * 100))
      .attr("r", 0)
      .attr("fill", "#0ea5e9") // Sky blue
      .attr("opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", (event: MouseEvent, d: ScatterData) => {
        d3.select(event.currentTarget as Element)
          .transition()
          .duration(200)
          .attr("r", 12)
          .attr("opacity", 1);
        
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`
          <strong>${d.category}</strong><br/>
          Accuracy: ${Math.round(d.accuracy * 100)}%<br/>
          Avg Time: ${(d.averageTimeMs / 1000).toFixed(1)}s
        `)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event: MouseEvent) => {
        d3.select(event.currentTarget as Element)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("opacity", 0.7);
        
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .delay((d: ScatterData, i: number) => i * 100)
      .attr("r", 8);
      
    // Cleanup tooltip on unmount
    return () => {
      d3.selectAll(".d3-tooltip").remove();
    };
  }, [data]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
