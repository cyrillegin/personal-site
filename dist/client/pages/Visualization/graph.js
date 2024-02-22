import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import './graph-styles.css';

const d3 = {
  ...require('d3-selection'), // eslint-disable-line
  ...require('d3-scale'), // eslint-disable-line
  ...require('d3-axis'), // eslint-disable-line
  ...require('d3-format'), // eslint-disable-line
  ...require('d3-shape'), // eslint-disable-line
  ...require('d3-array'), // eslint-disable-line
};

const styles = theme => ({
  root: {},
});

export class Graph extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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

  state = {
    mounted: false,
  };

  drawGraph() {
    if (this.props.points.length === 0) {
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
      .domain([this.props.ranges.xMin, this.props.ranges.xMax]) // input
      .range([0, width]); // output

    const yScale = d3
      .scaleLinear()
      .domain([this.props.ranges.yMin, this.props.ranges.yMax]) // input
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
      .tickValues(getTic(this.props.ranges.yMax, this.props.ranges.yMin));

    newChart
      .append('g')
      .attr('class', 'chart-axis-shape')
      .call(yAxis);

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickSizeInner(-height + margin.bottom + margin.top)
      .tickSizeOuter(0)
      .tickPadding(10)
      .ticks(10);

    newChart
      .append('g')
      .attr('class', 'chart-axis-shape')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    // Top border
    newChart
      .append('g')
      .append('line')
      .attr('class', 'chart-axis-shape')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', margin.bottom)
      .attr('y2', margin.bottom);

    // Right border
    newChart
      .append('g')
      .append('line')
      .attr('class', 'chart-axis-shape')
      .attr('x1', width)
      .attr('x2', width)
      .attr('y1', margin.bottom)
      .attr('y2', height - margin.bottom);

    // Graph lines
    const lineFunction = d3
      .line()
      .defined(d => {
        return (
          d.x <= this.props.ranges.xMax &&
          d.x >= this.props.ranges.xMin &&
          d.y >= this.props.ranges.yMin &&
          d.y <= this.props.ranges.yMax
        );
      })
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    newChart
      .append('path')
      .attr('d', lineFunction(this.props.points))
      .attr('stroke', 'rgba(45, 100, 255, 0.87)')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  } // End D3

  componentDidMount() {
    this.drawGraph();
    this.setState({
      mounted: true,
    });
  }

  render() {
    if (this.state.mounted) {
      this.drawGraph();
    }
    return (
      <div className={this.props.classes.root}>
        <div id="graph-container" />
      </div>
    );
  }
}

export default withStyles(styles)(Graph);
