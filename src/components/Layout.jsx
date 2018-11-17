import React from "react";

class Layout extends React.Component {
  static BoilerplateText = () => (<p>There's going to be a bunch of content here in this side panel. We won't need to worry about it for now. Let's just focus on rendering a chart with D3 and React in the main panel!</p>);

  getStateAndHelpers() {
    return {};
  }
  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default Layout;
