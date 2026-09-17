import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface CategoryData {
  category: string;
  accuracy: number;
}

interface Props {
  data: CategoryData[];
}

export const D3CategoryChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 160 };
    const width = 600 - margin.left - margin.right;
    const height = Math.max(300, data.length * 35) - margin.top - margin.bottom;

    const chart = svg
      .attr("viewBox", `0 0 600 ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, height])
      .padding(0.3);

    // X Axis
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + "%"))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "12px");

    // Y Axis
    chart.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .attr("color", "#64748b")
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .attr("dx", "-10px");

    // Grid lines
    chart.append("g")
      .attr("class", "grid")
      .attr("color", "#f1f5f9")
      .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3");

    // Bars
    chart.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", (d: CategoryData) => y(d.category) as number)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", "#8b5cf6") // Violet
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .attr("width", (d: CategoryData) => x(d.accuracy * 100));

    // Value Labels
    chart.selectAll("myText")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d: CategoryData) => x(d.accuracy * 100) + 5)
      .attr("y", (d: CategoryData) => (y(d.category) as number) + y.bandwidth() / 2 + 4)
      .text((d: CategoryData) => Math.round(d.accuracy * 100) + "%")
      .attr("fill", "#64748b")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .transition()
      .delay(800)
      .duration(500)
      .style("opacity", 1);

  }, [data]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
