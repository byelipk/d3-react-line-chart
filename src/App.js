import React, { Component } from "react";
import "./App.scss";
import dayjs from "dayjs";

import Header from "./components/Header";
import Layout from "./components/Layout";
import LineChart from "./components/LineChart";
import Tooltip from "./components/Tooltip";

class App extends Component {
  state = {
    data: []
  };
  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL || ""}/data.json`)
      .then(response => response.json())
      .then(json => {
        return json["collection"].map(item =>
          Object.assign({}, item, { date: new Date(item.date) })
        );
      })
      .then(data => {
        this.setState({ data: data });
      });
  }

  handleMouseEnter = (d, e) => {
    const { left, top } = e.target.getBoundingClientRect();

    this._positionLeft = left;
    this._positionTop = top + 20;

    this.setState({
      showTooltip: true,
      tooltipData: d
    });
  };
  handleMouseLeave = () => {
    this.setState({
      showTooltip: false,
      tooltipData: null
    });
  };
  handleClick = () => {
    this.setState({
      showTooltip: false,
      tooltipData: null
    });
  };
  render() {
    return (
      <div>
        <Header>
          {_state => (
            <header className="header u-flex">
              <div className="container u-flex u-align-center u-justify-between u-flex-1">
                <div className="logo" />
                <img
                  src="/avatar.jpg"
                  className="avatar"
                  alt="A random avatar."
                />
              </div>
            </header>
          )}
        </Header>
        <Layout>
          {layout => (
            <div
              className="layout u-flex container line-chart-container"
              ref={layout.setContainerRef}
            >
              <LineChart
                height={layout.height}
                width={layout.width}
                data={this.state.data}
              >
                {chart => (
                  <svg
                    className="line-chart"
                    height={chart.height}
                    width={chart.width}
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                  >
                    <g ref={chart.setXAxisRef} {...chart.getXAxisProps()} />
                    <g ref={chart.setYAxisRef} {...chart.getYAxisProps()} />
                    <path {...chart.getAreaProps()} />
                    <path {...chart.getLineProps()} />
                    {chart.data.map((d, i) => (
                      <circle
                        key={`circle-${i}`}
                        {...chart.getCircleProps({
                          d: d,
                          onMouseEnter: e => this.handleMouseEnter(d, e, i),
                          onMouseLeave: e => this.handleMouseLeave(d, e)
                        })}
                      />
                    ))}
                  </svg>
                )}
              </LineChart>

              {this.state.showTooltip ? (
                <Tooltip>
                  <div
                    className="tooltip pane"
                    style={{
                      left: this._positionLeft,
                      top: this._positionTop
                    }}
                  >
                    <div className="pane-body pane-body--padded">
                      <p>
                        Week of{" "}
                        {dayjs(this.state.tooltipData.date).format("MMM D")}
                      </p>
                      <p>{this.state.tooltipData.count} views</p>
                      <p>12 from last week</p>
                    </div>
                  </div>
                </Tooltip>
              ) : null}
            </div>
          )}
        </Layout>
      </div>
    );
  }
}

export default App;
