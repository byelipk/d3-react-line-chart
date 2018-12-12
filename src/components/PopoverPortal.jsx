import React from 'react'
import ReactDOM from 'react-dom'

const popoverRoot = document.getElementById('profile-activity-popover');

class PopoverPortal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    popoverRoot.appendChild(this.el);
    popoverRoot.classList.add("visible");
  }

  componentWillUnmount() {
    popoverRoot.removeChild(this.el);
    popoverRoot.classList.remove("visible");
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

export default PopoverPortal;