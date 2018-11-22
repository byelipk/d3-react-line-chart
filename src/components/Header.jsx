import React from "react";

class Header extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  getStateAndHelpers() {
    return {};
  }
  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

export default Header;
