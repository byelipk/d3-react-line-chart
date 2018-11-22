import React from 'react'
import ReactDOM from 'react-dom'

const tooltipRoot = document.getElementById('tooltip');

class Popover extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    tooltipRoot.appendChild(this.el);
    tooltipRoot.classList.add("visible");
  }

  componentWillUnmount() {
    tooltipRoot.removeChild(this.el);
    tooltipRoot.classList.remove("visible");
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

export default Popover;