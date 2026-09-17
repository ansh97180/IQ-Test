import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface BenchmarkData {
  category: string;
  score: number;
  benchmarkMean: number;
  benchmarkSD: number;
}

interface Props {
  data: BenchmarkData[];
}

export const D3BenchmarkChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 220 };
    const width = 800 - margin.left - margin.right;
    const height = Math.max(400, data.length * 50) - margin.top - margin.bottom;

    const chart = svg
      .attr("viewBox", `0 0 800 ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, height])
      .padding(0.4);

    // X Axis
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + "%"))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "12px");
      
    // Add "Lower", "Average", "Higher" labels below x-axis
    chart.append("text")
      .attr("x", x(15))
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#64748b")
      .text("Lower");
      
    chart.append("text")
      .attr("x", x(50))
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#64748b")
      .text("← Average →");
      
    chart.append("text")
      .attr("x", x(85))
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#64748b")
      .text("Higher");

    // Y Axis
    chart.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .attr("color", "#64748b")
      .selectAll("text")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .attr("dx", "-10px");

    // Background bands (Average ranges)
    chart.selectAll("benchmarkRange")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(Math.max(0, d.benchmarkMean - d.benchmarkSD)))
      .attr("y", d => (y(d.category) as number) - 4)
      .attr("width", d => x(Math.min(100, d.benchmarkMean + d.benchmarkSD)) - x(Math.max(0, d.benchmarkMean - d.benchmarkSD)))
      .attr("height", y.bandwidth() + 8)
      .attr("fill", "#f1f5f9") // slate-100
      .attr("rx", 4);
      
    // Benchmark Mean lines
    chart.selectAll("benchmarkMean")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", d => x(d.benchmarkMean))
      .attr("x2", d => x(d.benchmarkMean))
      .attr("y1", d => (y(d.category) as number) - 6)
      .attr("y2", d => (y(d.category) as number) + y.bandwidth() + 6)
      .attr("stroke", "#cbd5e1") // slate-300
      .attr("stroke-width", 2)
      .style("stroke-dasharray", "4,4");

    // User score bars
    chart.selectAll("userScore")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.category) as number)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", "#8b5cf6") // Violet
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .attr("width", d => x(d.score));

    // Value Labels
    chart.selectAll("myText")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => x(d.score) + 8)
      .attr("y", d => (y(d.category) as number) + y.bandwidth() / 2 + 4)
      .text(d => Math.round(d.score) + "%")
      .attr("fill", "#64748b")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .transition()
      .delay(800)
      .duration(500)
      .style("opacity", 1);
      
    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left}, 10)`);
      
    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", "#8b5cf6")
      .attr("rx", 2);
      
    legend.append("text")
      .attr("x", 24)
      .attr("y", 12)
      .text("Your Accuracy")
      .style("font-size", "12px")
      .style("fill", "#64748b");
      
    legend.append("rect")
      .attr("x", 120)
      .attr("y", 0)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", "#f1f5f9")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-dasharray", "2,2")
      .attr("rx", 2);
      
    legend.append("text")
      .attr("x", 144)
      .attr("y", 12)
      .text("Reference Benchmark Range (±1 SD)")
      .style("font-size", "12px")
      .style("fill", "#64748b");

  }, [data]);

  return (
    <div className="w-full h-full min-h-[400px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
