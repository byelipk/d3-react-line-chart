import React from "react";

import { _aspectRatio } from "../helpers";

class Layout extends React.Component {
  static BoilerplateText = () => (
    <p>
      There's going to be a bunch of content here in this side panel. We won't
      need to worry about it for now. Let's just focus on rendering a chart with
      D3 and React in the main panel!
    </p>
  );

  _latestKnownWidth = 1178;
  _latestKnownHeight = _aspectRatio(this._latestKnownWidth) * this._latestKnownWidth;

  _initialState = {
    height: 0,
    width: 0
  };
  state = this._initialState;

  setContainerRef = el => (this._containerRef = el);

  handleResize = () => {
    const currentWidth = this._containerRef.clientWidth;
    this._latestKnownWidth = currentWidth;
    this._latestKnownHeight = _aspectRatio(this._latestKnownWidth) * this._latestKnownWidth;

    this.setState({
      width: this._latestKnownWidth,
      height: this._latestKnownHeight
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);

    this.handleResize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
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

export default Layout;
