import React from "react";
import PropTypes from "prop-types";
import {
  select,
  extent,
  scaleTime,
  scaleLinear,
  line,
  area,
  axisBottom,
  axisLeft
} from "d3";

// const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

// const margin = { top: 30, right: 30, bottom: 80, left: 70 };
// width  = ($container.offsetWidth   - margin.left - margin.right),
// height = ($container.offsetHeight - 100 - margin.top - margin.bottom);

// const xScale = d3.scaleTime().range([0, width])
// const yScale = d3.scaleLinear().range([height, 0])

class LineChart extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    stateReducer: PropTypes.func.isRequired,
    xAxisKey: PropTypes.string.isRequired,
    yAxisKey: PropTypes.string.isRequired,
    margin: PropTypes.shape({
      top: PropTypes.number.isRequired,
      bottom: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      right: PropTypes.number.isRequired
    }).isRequired
  };

  static defaultProps = {
    height: 500,
    width: 300,
    xAxisKey: "date",
    yAxisKey: "count",
    stateReducer: (state, changes) => ({ ...state, ...changes }),
    onFetchData: () => Promise.resolve([]),
    margin: { top: 20, right: 0, bottom: 50, left: 50 }
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    const { margin, xAxisKey, yAxisKey, data, height, width } = nextProps;

    // NOTE
    // Remember to subtract the appropriate margin values
    // when creating the scales.

    // Create the x-axis scale.
    const timeDomain = extent(data, d => d[xAxisKey]);
    const xScale = scaleTime()
      .domain(timeDomain)
      .range([margin.left, width - margin.right - margin.left]);

    // Create the y-axis scale
    const countDomain = extent(data, d => d[yAxisKey]);
    const yScale = scaleLinear()
      .domain(countDomain)
      .range([height - margin.bottom, margin.top]);

    return {
      xScale,
      yScale
    };
  }

  // Private instance variables, things that if changed should
  // not cause a re-render.
  _ticking = false;
  _latestKnownWidth = null;
  _latestKnownHeight = null;

  _containerRef = null;
  _xAxisRef = null;
  _yAxisRef = null;

  _xAxis = axisBottom();
  _yAxis = axisLeft();


  // Setup component state
  initialState = {
  };
  state = this.initialState;

  internalSetState(changes, callback) {
    this.setState(state => {
      const changesObject =
        typeof changes === "function" ? changes(state) : changes;

      const reducedChanges =
        this.props.stateReducer(state, changesObject) || {};

      return Object.keys(reducedChanges).length ? reducedChanges : null;
    }, callback);
  }

  componentDidUpdate() {
    this.drawComplicatedD3Axis();
  }

  drawComplicatedD3Axis = () => {
    if (this.state.xScale && this.state.yScale) {
      this._xAxis
        .scale(this.state.xScale)
        .tickSizeOuter(0)
        .tickSizeInner(10)
        .tickPadding(10)
        .ticks(6, "%B %d");

      this._yAxis
        .scale(this.state.yScale)
        .tickSizeOuter(0)
        .tickSizeInner(-this.props.width + this.props.margin.left * 2)
        .tickPadding(15)
        .ticks(6);

      // Have D3 build the complicated x and y scales.
      select(this._xAxisRef).call(this._xAxis);
      select(this._yAxisRef).call(this._yAxis);
    }
  };

  setXAxisRef = el => (this._xAxisRef = el);
  setYAxisRef = el => (this._yAxisRef = el);

  getXAxisProps = props => {
    return {
      className: "x-axis",
      transform: `translate(0, ${this.props.height -
        this.props.margin.bottom})`,
      ...props
    };
  };
  getYAxisProps = props => {
    return {
      className: "y-axis",
      transform: `translate(${this.props.margin.left}, 0)`,
      ...props
    };
  };
  getCircleProps = ({ d, ...props }) => {
    return {
      className: "circle",
      r: "7.5",
      cx: this.state.xScale(d.date),
      cy: this.state.yScale(d.count),
      ...props
    };
  };
  getLineProps = props => {
    // Build the line generator
    const lineGenerator = line()
      .x(d => this.state.xScale(d[this.props.xAxisKey]))
      .y(d => this.state.yScale(d[this.props.yAxisKey]));

    // Return an object that will be applied as props to an svg <path /> element
    return {
      className: "line",
      fill: "none",
      d: lineGenerator(this.props.data),
      strokeWidth: 2,
      stroke: "#979797",
      ...props
    };
  };
  getAreaProps = props => {
    const areaGenerator = area()
      .x(d => this.state.xScale(d.date))
      .y0(this.props.height - this.props.margin.bottom)
      .y1(d => this.state.yScale(d.count));

    return {
      className: "area",
      fill: "#D7E0E7",
      opacity: "0.65",
      d: areaGenerator(this.props.data),
      ...props
    };
  };

  getStateAndHelpers() {
    return {
      data: this.props.data,
      height: this.props.height,
      width: this.props.width,
      setXAxisRef: this.setXAxisRef,
      setYAxisRef: this.setYAxisRef,
      getLineProps: this.getLineProps,
      getCircleProps: this.getCircleProps,
      getAreaProps: this.getAreaProps,
      getXAxisProps: this.getXAxisProps,
      getYAxisProps: this.getYAxisProps
    };
  }
  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default LineChart;
