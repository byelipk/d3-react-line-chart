import React from "react";
import PropTypes from "prop-types";
import { scaleTime, scaleLinear, line } from "d3";

// const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

// const margin = { top: 30, right: 30, bottom: 80, left: 70 };
// width  = ($container.offsetWidth   - margin.left - margin.right),
// height = ($container.offsetHeight - 100 - margin.top - margin.bottom);

// const xScale = d3.scaleTime().range([0, width])
// const yScale = d3.scaleLinear().range([height, 0])

class LineChart extends React.Component {
  static propTypes = {
    initialLoading: PropTypes.bool.isRequired,
    stateReducer: PropTypes.func.isRequired
  };

  static defaultProps = {
    initialLoading: true,
    initialHeight: 100,
    initialWidth: 100,
    initialMargin: { top: 0, bottom: 0, left: 0, right: 0 },
    stateReducer: (state, changes) => changes
  };

  // Private instance variables
  _ticking = false;
  _latestKnownWidth = null;
  _latestKnownHeight = null;
  _containerRef = null;

  // Setup component state
  initialState = {
    isLoading: this.props.initialLoading,
    width: this.props.initialWidth,
    height: this.props.initialHeight,
    margin: this.props.initialMargin
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
    }
  };
  requestTick = () => {
    if (!this._ticking) {
      window.requestAnimationFrame(this.update);
    }
    this._ticking = true;
  };
  update = () => {
    let currentKnownWidth = this._latestKnownWidth;
    let currentKnownHeight = this._latestKnownHeight;

    // Make any updates that we need...
    this.internalSetState(() => ({
      width: currentKnownWidth,
      height: currentKnownHeight
    }));
  };

  componentDidMount() {
    // Setup resize handler
    window.addEventListener("resize", this.handleResize);

    this.handleResize();

    // Fetch data
    fetch(`${process.env.PUBLIC_URL || ""}/data.json`)
      .then(response => response.json())
      .then(data => {
        const mappedCollection = data["collection"].map(item =>
          Object.assign({}, item, { date: new Date(item.date) })
        );
        
        this.internalSetState(() => ({
          isLoading: false,
          data: mappedCollection
        }));
      });
  }
  componentWillUnmount() {
    // Cleanup resize handler
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.data) {
      console.log("DUDE");
    }
  }

  // Props getters we pass to the consumer of the <LineChart /> component
  getXAxisProps = () => {};
  getYAxisProps = () => {};
  getLineProps = () => {};
  setContainerRef = el => (this._containerRef = el);
  getStateAndHelpers() {
    return {
      height: this.state.height,
      width: this.state.width,
      color: "black",
      setContainerRef: this.setContainerRef,
      isLoading: this.state.isLoading,
      getXAxisProps: this.getXAxisProps,
      getYAxisProps: this.getYAxisProps,
      getLineProps: this.getLineProps
    };
  }
  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default LineChart;
