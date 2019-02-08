/* eslint 'react/sort-comp': off, 'react/jsx-no-bind': off */

import React, { Component } from 'react';
import moment from 'moment';
// import 'moment/locale/zh-tw';
// import 'moment/locale/zh-cn';
// import 'moment/locale/es-us';
import Datetime from 'react-datetime';

class DatetimeRangePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      start: moment(props.startDate), 
      end: moment(props.endDate), 
      startDate: props.startDate, 
      endDate: props.endDate, 
    };
  }

  componentWillReceiveProps ({ currentLanguge, startDate, endDate }) {
    // console.log('> newProps.value: ', newProps.value);
    // moment.locale(currentLanguge);
    if (String(startDate) === String(this.props.startDate) 
    && String(endDate) === String(this.props.endDate)) return;
		this.setState({
			start: moment(startDate), 
      end: moment(endDate), 
      startDate, 
      endDate, 
		});
	}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.startDate === prevState.startDate && nextProps.endDate === prevState.endDate
      ? {}
      : { 
          start: moment(nextProps.startDate), 
          end: moment(nextProps.endDate), 
          startDate: nextProps.startDate, 
          endDate: nextProps.endDate, 
        }
  }

  getInputProps() {
    const inputReadOnlyStyle = {
      cursor: 'pointer',
      backgroundColor: 'white',
      border: '1px solid #e2e2e2',
    };

    return this.props.input
      ? this.props.inputProps
      : {
        input: true,
        inputProps: {
          ...this.props.inputProps,     // merge inputProps with default
          readOnly: true,
          style: inputReadOnlyStyle,
        },
      };
  }

  propsToPass() {
    return {
      end: this.state.end.toDate(),
      start: this.state.start.toDate(),
    };
  }

  calcBaseProps() {
    return {
      utc: this.props.utc,
      locale: this.props.locale,
      currentLanguge: this.props.currentLanguge,
      input: !this.props.inline,
      viewMode: this.props.viewMode,
      dateFormat: this.props.dateFormat,
      timeFormat: this.props.timeFormat,
      closeOnTab: this.props.closeOnTab,
      className: this.props.pickerClassName,
      closeOnSelect: this.props.closeOnSelect,
    };
  }


  calcStartTimeProps() {
    const baseProps = this.calcBaseProps();
    const inputProps = this.getInputProps();

    return {
      ...baseProps,
      ...inputProps,
      value: this.state.start || null,
      onBlur: this.props.onStartDateBlur,
      onFocus: this.props.onStartDateFocus,
      timeConstraints: this.props.startTimeConstraints,
    };
  }

  calcEndTimeProps() {
    const baseProps = this.calcBaseProps();
    const inputProps = this.getInputProps();

    return {
      ...baseProps,
      ...inputProps,
      onBlur: this.props.onEndDateBlur,
      value: this.state.end || null,
      onFocus: this.props.onEndDateFocus,
      timeConstraints: this.props.endTimeConstraints,
    };
  }

  validateMinDate(date) {
    return this.state.start && this.state.start.isSameOrBefore(date, 'day');
  }

  isValidEndDate(currentDate, selectedDate) {
    return this.validateMinDate(currentDate)
      && this.props.isValidEndDate(currentDate, selectedDate);
  }

  onStartDateChange(date) {
    const options = {
      start: date,
    };
    
    if (this.state.end && this.state.end.isBefore(date)) {
      options.end = date.add(1, 'd');
    }

    this.setState(options, () => {
      this.props.onChange(this.propsToPass());
      this.props.onStartDateChange(this.propsToPass().start);
    });
  }

  onEndDateChange(date) {
    this.setState({ end: date }, () => {
      this.props.onChange(this.propsToPass());
      this.props.onEndDateChange(this.propsToPass().end);
    });
  }

  onFocus() {
    this.props.onFocus();
  }

  onBlur() {
    this.props.onBlur(this.propsToPass());
  }

  renderDay(props, currentDate) {
    const { start, end } = this.state;
    const { className, ...rest } = props;
    const date = moment(props.key, 'M_D');

    // style all dates in range
    let classes = start && end && date.isBetween(start, end, 'day')
      ? `${props.className} in-selecting-range` : props.className;

    // add rdtActive to selected startdate and endDate in pickers
    classes = (start && date.isSame(start, 'day')) 
    || (end && date.isSame(end, 'day')) ? `${classes} rdtActive` : classes;

    return (
      <td {...rest}
        className={classes}>
        {currentDate.date()}
      </td>
    );
  }
  render() {
    const startProps = this.calcStartTimeProps();
    const endProps = this.calcEndTimeProps();

    return (
      <div
        className={this.props.className}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}>
        <Datetime
          {...startProps}
          isValidDate={this.props.isValidStartDate}
          onChange={this.onStartDateChange.bind(this)}
          renderDay={this.renderDay.bind(this)} />

        <Datetime
          {...endProps}
          isValidDate={this.isValidEndDate.bind(this)}
          onChange={this.onEndDateChange.bind(this)}
          renderDay={this.renderDay.bind(this)} />
      </div>
    );
  }
}

DatetimeRangePicker.defaultProps = {
  utc: false,
  locale: 'en-US',
  currentLanguge: 'en-US',
  input: false,   // This defines whether or not to to edit date manually via input
  inline: false,  // This defines whether or not to show input field
  className: '',
  viewMode: 'days',
  dateFormat: true,
  timeFormat: true,
  closeOnTab: true,
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
  pickerClassName: '',
  endDate: new Date(),
  closeOnSelect: false,
  inputProps: undefined,
  startDate: new Date(),
  onEndDateBlur: () => {},
  endTimeConstraints: {},
  onEndDateFocus: () => {},
  isValidStartDate: () => true,
  isValidEndDate: () => true,
  onStartDateBlur: () => {},
  onEndDateChange: () => {},    // This is called after onChange
  onStartDateFocus: () => {},
  startTimeConstraints: {},
  onStartDateChange: () => {},  // This is called after onChange
};


DatetimeRangePicker.propTypes = {
  utc: React.PropTypes.bool,
  input: React.PropTypes.bool,
  inline: React.PropTypes.bool,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  locale: React.PropTypes.string,
  currentLanguge: React.PropTypes.string,
  onChange: React.PropTypes.func,
  viewMode: React.PropTypes.oneOf(['years', 'months', 'days', 'time']),
  closeOnTab: React.PropTypes.bool,
  className: React.PropTypes.string,
  inputProps: React.PropTypes.object,   // eslint-disable-line
  closeOnSelect: React.PropTypes.bool,
  isValidEndDate: React.PropTypes.func,
  onEndDateBlur: React.PropTypes.func,
  onEndDateFocus: React.PropTypes.func,
  onEndDateChange: React.PropTypes.func,
  onStartDateBlur: React.PropTypes.func,
  isValidStartDate: React.PropTypes.func,
  onStartDateFocus: React.PropTypes.func,
  onStartDateChange: React.PropTypes.func,
  pickerClassName: React.PropTypes.string,
  defaultEndDate: React.PropTypes.oneOfType([React.PropTypes.instanceOf(moment), React.PropTypes.instanceOf(Date)]),
  endDate: React.PropTypes.oneOfType([React.PropTypes.instanceOf(moment), React.PropTypes.instanceOf(Date)]),
  endTimeConstraints: React.PropTypes.object,   // eslint-disable-line
  startDate: React.PropTypes.oneOfType([React.PropTypes.instanceOf(moment), React.PropTypes.instanceOf(Date)]),
  defaultStartDate: React.PropTypes.oneOfType([React.PropTypes.instanceOf(moment), React.PropTypes.instanceOf(Date)]),
  startTimeConstraints: React.PropTypes.object,   // eslint-disable-line
  dateFormat: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
  timeFormat: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
};

export default DatetimeRangePicker;
