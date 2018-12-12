import React from "react";

import "./App.scss";

import Header from "./components/Header";
import Layout from "./components/Layout";

import ProfileActivityView from "./components/ProfileActivityView";

const data = [
  { date: "2018-12-3", views: 12 },
  { date: "2018-12-10", views: 47 },
  { date: "2018-12-17", views: 129 },
  { date: "2018-12-24", views: 98 },
  { date: "2018-12-31", views: 154 },
  { date: "2019-1-7", views: 34 },
  { date: "2019-1-14", views: 78 },
  { date: "2019-1-21", views: 90 },
  { date: "2019-1-28", views: 68 },
  { date: "2019-2-4", views: 87 }
];

class App extends React.Component {
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
            <div className="layout u-flex container line-chart-container">
              <ProfileActivityView data={data} />
            </div>
          )}
        </Layout>
      </div>
    );
  }
}

export default App;
