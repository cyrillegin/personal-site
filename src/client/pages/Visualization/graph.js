import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(() => ({
  ChartAxisShape: {
    fill: 'none',
    shapeRendering: 'crispEdges',
    stroke: '#000',
    strokeWidth: '1px'
  },
  
  'ChartAxisShape > g > line': {
    strokeOpacity: '0.2'
  },
  
  'ChartAxisShape > g > text': {
    stroke: 'none',
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif'
  }
  
}));

const d3 = {
  ...require('d3-selection'),
  ...require('d3-scale'),
  ...require('d3-axis'),
  ...require('d3-format'),
  ...require('d3-shape'),
  ...require('d3-array'),
};

export const Graph = props => {

  const classes = useStyles();

  const [state, setState] = useState({
    mounted: false,
  });

  const drawGraph = () => {
    if (props.points.length === 0) {
      return;
    }
    // Initialization.
    const container = document.querySelector('#graph-container');
    container.innerHTML = '';

    let width = container.clientWidth;

    let height = 400;
    const margin = {
      top: 10,
      right: 20,
      bottom: 10,
      left: 30,
    };
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    // Create the svg.
    const newChart = d3
      .select('#graph-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.bottom})`)
      .classed('svg-content-responsive', true);

    const xScale = d3
      .scaleLinear()
      .domain([props.ranges.xMin, props.ranges.xMax]) // input
      .range([0, width]); // output

    const yScale = d3
      .scaleLinear()
      .domain([props.ranges.yMin, props.ranges.yMax]) // input
      .range([height - margin.bottom, margin.top]); // output

    // Y Axis
    function getTic(yMin, yMax) {
      const Ticks = [];
      const ratio = (yMax - yMin) / 6;
      for (let q = 0; q < 7; q++) {
        Ticks.push(yMin + ratio * q);
      }
      return Ticks;
    }

    const yAxis = d3
      .axisLeft(yScale)
      .tickSizeInner(-width)
      .tickSizeOuter(0)
      .tickValues(getTic(props.ranges.yMax, props.ranges.yMin));

    newChart.append('g').attr('class', classes.ChartAxisShape).call(yAxis);

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickSizeInner(-height + margin.bottom + margin.top)
      .tickSizeOuter(0)
      .tickPadding(10)
      .ticks(10);

    newChart
      .append('g')
      .attr('class', classes.ChartAxisShape)
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    // Top border
    newChart
      .append('g')
      .append('line')
      .attr('class', classes.ChartAxisShape)
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', margin.bottom)
      .attr('y2', margin.bottom);

    // Right border
    newChart
      .append('g')
      .append('line')
      .attr('class', classes.ChartAxisShape)
      .attr('x1', width)
      .attr('x2', width)
      .attr('y1', margin.bottom)
      .attr('y2', height - margin.bottom);

    // Graph lines
    const lineFunction = d3
      .line()
      .defined(d => {
        return (
          d.x <= props.ranges.xMax &&
          d.x >= props.ranges.xMin &&
          d.y >= props.ranges.yMin &&
          d.y <= props.ranges.yMax
        );
      })
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    newChart
      .append('path')
      .attr('d', lineFunction(props.points))
      .attr('stroke', 'rgba(45, 100, 255, 0.87)')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }; // End D3

  useEffect(() => {
    drawGraph();
    setState({
      mounted: true,
    });
  }, []);

  if (state.mounted) {
    drawGraph();
  }
  return (
    <div>
      <div id="graph-container" />
    </div>
  );
};


Graph.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  ).isRequired,
  ranges: PropTypes.shape({
    xMin: PropTypes.number.isRequired,
    xMax: PropTypes.number.isRequired,
    yMin: PropTypes.number.isRequired,
    yMax: PropTypes.number.isRequired,
  }).isRequired,
};