import React, { Component } from "react";
import "./App.scss";

import Header from "./components/Header";
import Layout from "./components/Layout";
import LineChart from "./components/LineChart";

class App extends Component {
  fetchData = () => {
    return fetch(`${process.env.PUBLIC_URL || ""}/data.json`)
      .then(response => response.json())
      .then(data => {
        return data["collection"].map(item =>
          Object.assign({}, item, { date: new Date(item.date) })
        );
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
          {_layoutState => (
            <div className="layout u-flex container">
              <div className="pane pane__left pane--primary u-flex-2">
                <LineChart onFetchData={this.fetchData}>
                  {lineChart => (
                    <div className="line-chart" ref={lineChart.setContainerRef}>
                      {lineChart.isLoading ? null : (
                        <svg height={lineChart.height} width={lineChart.width}>
                          <path
                            {...lineChart.getLineProps({
                              strokeWidth: 3,
                              stroke: "purple"
                            })}
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </LineChart>
              </div>
              <div className="pane pane__right u-flex-1">
                <Layout.BoilerplateText />
              </div>
            </div>
          )}
        </Layout>
      </div>
    );
  }
}

export default App;
