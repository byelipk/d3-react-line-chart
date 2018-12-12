import React from "react";

import { aspectRatio } from "../aspect-ratio";

class ResponsiveSVGContainer extends React.Component {
  _ticking = false;
  _latestKnownWidth = 500;
  _latestKnownHeight = aspectRatio(this._latestKnownWidth) * this._latestKnownWidth;

  _initialState = {
    height: this._latestKnownWidth,
    width: this._latestKnownHeight
  };
  state = this._initialState;

  setContainerRef = el => (this._containerRef = el);

  handleResize = () => {
    if (this._containerRef && !this._ticking) {
      this._ticking = true;

      this._latestKnownWidth = this._containerRef.clientWidth;
      this._latestKnownHeight = aspectRatio(this._latestKnownWidth) * this._latestKnownWidth;
  
      this.setState({
        width: this._latestKnownWidth,
        height: this._latestKnownHeight
      }, () => {
        this._ticking = false;
      });
    }
  };

  componentDidMount() {
    if (window) {
      window.addEventListener("resize", this.handleResize);
    }

    this.handleResize();
  }
  componentWillUnmount() {
    if (window) {
      window.removeEventListener("resize", this.handleResize);
    }
  }

  getStateAndHelpers() {
    return {
      setContainerRef: this.setContainerRef,
      height: this.state.height,
      width: this.state.width
    };
  }
  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default ResponsiveSVGContainer;
