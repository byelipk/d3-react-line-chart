import React from "react";
import PropTypes from "prop-types";
import { extent, scaleTime, scaleLinear, line } from "d3";

// const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

// const margin = { top: 30, right: 30, bottom: 80, left: 70 };
// width  = ($container.offsetWidth   - margin.left - margin.right),
// height = ($container.offsetHeight - 100 - margin.top - margin.bottom);

// const xScale = d3.scaleTime().range([0, width])
// const yScale = d3.scaleLinear().range([height, 0])

class LineChart extends React.Component {
  static propTypes = {
    onFetchData: PropTypes.func.isRequired,
    initialLoading: PropTypes.bool.isRequired,
    stateReducer: PropTypes.func.isRequired
  };

  static defaultProps = {
    initialLoading: true,
    initialMargin: { top: 0, bottom: 0, left: 0, right: 0 },
    initialHeight: 100,
    initialWidth: 100,
    stateReducer: (state, changes) => changes,
    onFetchData: () => Promise.resolve([])
  };

  // Private instance variables
  _ticking = false;
  _latestKnownWidth = null;
  _latestKnownHeight = null;
  _containerRef = null;

  // Setup component state
  initialState = {
    isLoading: this.props.initialLoading,
    margin: this.props.initialMargin,
    width: this.props.initialWidth,
    height: this.props.initialHeight
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
  handleResize = () => {
    if (this._containerRef) {
      this._latestKnownWidth = this._containerRef.clientWidth;
      this._latestKnownHeight = this._containerRef.clientHeight;
      this.requestTick();
    } else {
      console.error("LineChart is missing a containerRef.");
    }
  };
  requestTick = () => {
    if (!this._ticking) {
      window.requestAnimationFrame(this.updateDimensions);
    }
    this._ticking = true;
  };
  updateDimensions = () => {
    let currentKnownWidth = this._latestKnownWidth;
    let currentKnownHeight = this._latestKnownHeight;

    // Make any updates that we need...
    this.internalSetState(
      state => ({
        ...state,
        width: currentKnownWidth,
        height: currentKnownHeight
      }),
      () => {
        this._ticking = false;
      }
    );
  };

  componentDidMount() {
    // Setup resize handler
    window.addEventListener("resize", this.handleResize);

    this.handleResize();

    // Fetch data
    this.props.onFetchData().then(data => {
      this.internalSetState(state => ({
        ...state,
        data,
        isLoading: false
      }));
    });
  }
  componentWillUnmount() {
    // Cleanup resize handler
    window.removeEventListener("resize", this.handleResize);
  }

  // Props getters we pass to the consumer of the <LineChart /> component
  getLineProps = (props = {}) => {
    if (this.state.data) {
      const data = this.state.data;
      const height = this.state.height;
      const width = this.state.width;

      // Create the x-axis scale
      const timeDomain = extent(data, d => d.date);
      const xScale = scaleTime()
        .domain(timeDomain)
        .range([0, width]);

      // Create the y-axis scale
      const countDomain = extent(data, d => d.count);
      const yScale = scaleLinear()
        .domain(countDomain)
        .range([height, 0]);

      // Build the line generator
      const lineGenerator = line().x(d => xScale(d.date));

      // Return on object that will be applied as props to an svg <path /> element
      return {
        fill: "none",
        d: lineGenerator.y(d => yScale(d.count))(data),
        strokeWidth: 2,
        stroke: "black",
        ...props
      };
    }
  };
  setContainerRef = el => (this._containerRef = el);
  getStateAndHelpers() {
    return {
      height: this.state.height,
      width: this.state.width,
      setContainerRef: this.setContainerRef,
      isLoading: this.state.isLoading,
      getLineProps: this.getLineProps
    };
  }
  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default LineChart;
