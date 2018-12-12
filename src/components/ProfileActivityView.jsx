import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Popper } from "react-popper";

import ResponsiveSVGContainer from "./ResponsiveSVGContainer";
import AreaChart from "./AreaChart";
import PopoverPortal from "./PopoverPortal";

import { diff } from "../percent-change";

// Joins sets of three numbers with a comma
const NUMBER_FORMAT_REGEX = /(\d)(?=(\d{3})+(?!\d))/g;
class ProfileActivityView extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        views: PropTypes.number.isRequired
      })
    ),
    yAxisKey: PropTypes.string.isRequired,
    xAxisKey: PropTypes.string.isRequired
  };

  static defaultProps = {
    xAxisKey: "date",
    yAxisKey: "views",
    data: []
  };

  _initialState = {
    showPopover: false,
    popoverData: null
  };
  state = this._initialState;
  handleMouseEnter = (e, i) => {
    this._popoverRef = e.target;

    const currWeek = this.props.data[i];
    const prevWeek = this.props.data[i - 1];

    this.setState({
      currWeek,
      currWeekIdx: i,
      showPopover: true,
      twoWeekDiff: diff(currWeek, prevWeek, this.props.yAxisKey)
    });
  };
  handleMouseLeave = () => {
    this._popoverRef = null;
    this.setState(this._initialState);
  };
  render() {
    const data = this.props.data;

    if (data.length === 0) {
      return null;
    }

    const totalViewsInLast90Days = data
      .reduce((acc, curr) => curr[this.props.yAxisKey] + acc, 0)
      .toString()
      .replace(NUMBER_FORMAT_REGEX, "$1,");

    return (
      <div className="profile-activity-panel-analytics profile-block">
        <div className="heading">
          <h2 className="title">Who viewed your profile</h2>
          <div className="subtitle">
            <span className="last-90-days">
              <strong>{totalViewsInLast90Days}</strong> Visits to your profile,
              events & promotions, and/or products & services
            </span>
          </div>
        </div>
        <hr />
        <ResponsiveSVGContainer>
          {container => (
            <div ref={container.setContainerRef}>
              <AreaChart
                width={container.width}
                height={container.height}
                data={data.map(item => ({
                  ...item,
                  date: new Date(item[this.props.xAxisKey])
                }))}
                yAxisKey={this.props.yAxisKey}
                xAxisKey={this.props.xAxisKey}
              >
                {chart => (
                  <svg
                    className="area-chart"
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    width={chart.width}
                    height={chart.height}
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
                          className: `circle ${
                            i === chart.data.length - 1 ? "current-week" : ""
                          }`,
                          onMouseEnter: e => this.handleMouseEnter(e, i),
                          onMouseLeave: e => this.handleMouseLeave(e, i)
                        })}
                      />
                    ))}
                  </svg>
                )}
              </AreaChart>
              {this.state.showPopover ? (
                <PopoverPortal>
                  <Popper
                    referenceElement={this._popoverRef}
                    placement="auto"
                    modifiers={{ offset: { offset: "-50%, 100%" } }}
                  >
                    {({ ref, style, placement, arrowProps }) => (
                      <div
                        className="profile-activity-popover"
                        ref={ref}
                        style={style}
                        data-placement={placement}
                      >
                        <div className="profile-activity-popover__heading">
                          {this.state.currWeekIdx === this.props.data.length - 1
                            ? "Partial"
                            : null}{" "}
                          Week of{" "}
                          {dayjs(this.state.currWeek.date).format("MMM D")}
                        </div>
                        <div className="profile-activity-popover__body">
                          {this.state.currWeekIdx ===
                          this.props.data.length - 1 ? null : (
                            <div>
                              {this.state.currWeek[this.props.yAxisKey]}{" "}
                              {this.state.currWeek[this.props.yAxisKey] === 1
                                ? "visit"
                                : "visits"}
                            </div>
                          )}
                          <div style={{ color: `${this.state.twoWeekDiff >= 0 ? 'inherit' : '#5B7D26'}` }}>
                            {this.state.currWeekIdx === 0 ? null : this.state
                                .currWeekIdx ===
                              this.props.data.length - 1 ? (
                              <span>
                                {this.state.currWeek[this.props.yAxisKey]}{" "}
                                {this.state.currWeek[this.props.yAxisKey] === 1
                                  ? "visit"
                                  : "visits"}{" "}
                                so far
                              </span>
                            ) : (
                              <span>
                                {this.state.twoWeekDiff >= 0 ? "+" : "-"}
                                {Math.abs(this.state.twoWeekDiff)} vs. prior
                                week
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className="profile-activity-popover__arrow"
                          ref={arrowProps.ref}
                          style={arrowProps.style}
                          data-placement={placement}
                        />
                      </div>
                    )}
                  </Popper>
                </PopoverPortal>
              ) : null}
            </div>
          )}
        </ResponsiveSVGContainer>
      </div>
    );
  }
}

export default ProfileActivityView;
