import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface Props {
  userScore: number;
}

export const D3PopulationChart: React.FC<Props> = ({ userScore }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const chart = svg
      .attr("viewBox", `0 0 600 300`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Generate normal distribution data
    const mean = 100;
    const stdDev = 15;
    const data: { x: number; y: number }[] = [];
    
    for (let i = 55; i <= 145; i += 1) {
      const exponent = Math.exp(-Math.pow(i - mean, 2) / (2 * Math.pow(stdDev, 2)));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
      data.push({ x: i, y });
    }

    // Scales
    const x = d3.scaleLinear()
      .domain([55, 145])
      .range([0, width]);

    const yMax = d3.max(data, d => d.y) || 0;
    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);

    // Area generator
    const area = d3.area<{ x: number; y: number }>()
      .x(d => x(d.x))
      .y0(height)
      .y1(d => y(d.y))
      .curve(d3.curveBasis);

    // Add gradient
    const gradient = chart.append("defs")
      .append("linearGradient")
      .attr("id", "popGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.4);
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.05);

    // Draw area
    chart.append("path")
      .datum(data)
      .attr("fill", "url(#popGradient)")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 2)
      .attr("d", area)
      .style("opacity", 0)
      .transition()
      .duration(1500)
      .style("opacity", 1);

    // X Axis
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues([70, 85, 100, 115, 130]).tickFormat(d => d.toString()))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "12px");

    // X Axis Label
    chart.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .text("Provisional Reasoning Index")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .attr("fill", "#64748b");

    // User Score Line
    const userLineGroup = chart.append("g")
      .attr("transform", `translate(${x(userScore)}, 0)`)
      .style("opacity", 0);

    userLineGroup.append("line")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4");

    userLineGroup.append("text")
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .text(`You (${userScore})`)
      .style("fill", "#ef4444")
      .style("font-size", "14px")
      .style("font-weight", "bold");

    userLineGroup.transition()
      .delay(1000)
      .duration(800)
      .style("opacity", 1);

    // Segments labels
    const segments = [
      { label: "68% of Population", x: 100, yPos: height / 2 },
    ];

    chart.selectAll(".segment-label")
      .data(segments)
      .enter()
      .append("text")
      .attr("x", d => x(d.x))
      .attr("y", d => d.yPos)
      .attr("text-anchor", "middle")
      .text(d => d.label)
      .style("fill", "#64748b")
      .style("font-size", "12px")
      .style("font-style", "italic")
      .style("opacity", 0)
      .transition()
      .delay(1800)
      .duration(500)
      .style("opacity", 1);

  }, [userScore]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
