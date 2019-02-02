import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from "react-i18next";
import moment from 'moment';
import _ from 'lodash';
import FullCalendar from 'sardius-fullcalendar-wrapper';
import { 
	ButtonToolbar, 
	ButtonGroup, 
	Button 
} from 'react-bootstrap';
import { 
	setFilter, 
	clearAllFilters, 
	setActiveColumns 
} from '../actions';

import { Container } from '../../../elemental';

const CalendarView = React.createClass({
	contextTypes: {
		events: React.PropTypes.object,
		calendarMap: React.PropTypes.string,
		calendarTitle: React.PropTypes.string,
		path: React.PropTypes.string,
		router: React.PropTypes.object.isRequired,
		defaultColumns: React.PropTypes.string,
		renderHeader: React.PropTypes.func,
		switchCalendarView: React.PropTypes.func,
	},
	getInitialState: function() {
		return {
			events: [],
			headerRightMargin: window.innerWidth >= 1370 ? 745 : 745 - (1370 - window.innerWidth),
		}
	},
	componentWillMount: function() {
		const { setActiveColumns, calendarMap, setFilter } = this.props;
		setActiveColumns(calendarMap);
		setFilter(calendarMap, {
			before: moment().add(1, 'month').endOf('month'),
			after: moment().subtract(1, 'month').startOf('month'),
			inverted: false,
			mode: 'between',
		}, 'zhtw');
	},
	componentWillReceiveProps: function(nextProps) {
		const { events, loading, ready, calendarMap, calendarTitle } = this.props;
		if (loading && !nextProps.loading) {
			var eventList = [];
			_.map(nextProps.events.results, (event) => {
				eventList.push({
					id: event.id,
					title: event[calendarTitle],
					start: event.fields[calendarMap],
					end: event.fields[calendarMap],
				});
			})
			this.setState({
				events: eventList,
			});
		}
	},
	componentDidMount: function() {
		window.addEventListener("resize", this.handleResize);
	},
	componentWillUnmount: function() {
		const { defaultColumns, setActiveColumns, clearAllFilters, switchCalendarView } = this.props;
		window.removeEventListener('resize', this.handleResize)
		setActiveColumns(defaultColumns);
		clearAllFilters();
		switchCalendarView(false);
	},
	filterEvent: function() {
		const { setFilter, calendarMap } = this.props;
		setFilter(calendarMap, {
			before: moment(this.fullCalendar.calendar.getDate()).add(1, 'month').endOf('month'),
			after: moment(this.fullCalendar.calendar.getDate()).subtract(1, 'month').startOf('month'),
			inverted: false,
			mode: 'between',
		});
	},
	handleResize: function() {
		this.setState({
			headerRightMargin: window.innerWidth >= 1370 ? 745 : 745 - (1370 - window.innerWidth),
		});
	},
	handleDateChange: function(action) {
		const currentDate = moment(this.fullCalendar.calendar.getDate());
		switch(action) {
			case 'prev':
				this.fullCalendar.calendar.prev();
				break;
			case 'next':
				this.fullCalendar.calendar.next();
				break;
			case 'today':
				this.fullCalendar.calendar.today();
				break;
		}
		if (!currentDate.isSame(moment(this.fullCalendar.calendar.getDate()), 'month')) this.filterEvent();
	},
	handleViewChange: function(view) {
		this.fullCalendar.calendar.changeView(view);
	},
	handleEventClick: function(event) {
		const { router, path } = this.props;
		router.push(`${Keystone.adminPath}/${path}/${event.event.id}`);
	},
	handleEventDrop: function(event) {
		/* save change */
		console.log('drop: ', event);
	},
	handleEventResize: function(event) {
		/* save change */
		console.log('resize: ', event);
	},
	render: function() {
		const { t, renderHeader } = this.props;
		const { events, headerRightMargin } = this.state;
		return (
			<div>
				{renderHeader()}
				<Container style={{ marginTop: `30px`, marginBottom: `30px` }}>
					
					<ButtonToolbar
						style={{
							position: `absolute`,
							top: `190px`,
						}}
					>
						<ButtonGroup>
							<Button onClick={() => this.handleDateChange('prev')}><div className="fc-icon fc-icon-left-single-arrow"/></Button>
							<Button onClick={() => this.handleDateChange('next')}><div className="fc-icon fc-icon-right-single-arrow"/></Button>
						</ButtonGroup>
						
						<ButtonGroup>
							<Button onClick={() => this.handleDateChange('today')}>{t(`calendar:today`)}</Button>
						</ButtonGroup>
						
						<ButtonGroup style={{ marginLeft: `${headerRightMargin}px` }}>
							<Button onClick={() => this.handleViewChange('month')}>{t(`calendar:month`)}</Button>
							<Button onClick={() => this.handleViewChange('agendaWeek')}>{t(`calendar:week`)}</Button>
							<Button onClick={() => this.handleViewChange('agendaDay')}>{t(`calendar:day`)}</Button>
							<Button onClick={() => this.handleViewChange('listDay')}>{t(`calendar:listDay`)}</Button>
						</ButtonGroup>
					</ButtonToolbar>
						
						
					<FullCalendar
						editable
						ref={(ref) => {this.fullCalendar = ref;}}
						header={{
							left: '',
							center: 'title',
							right: ''
						}}
						defaultView={
							this.fullCalendar ? 
								this.fullCalendar.calendar.getView().type
							:
								'month'
						}
						defaultDate={
							this.fullCalendar ? 
								moment(this.fullCalendar.calendar.getDate()).format('YYYY-MM-DD') 
							: 
								moment().format('YYYY-MM-DD')
						}
						navLinks={true}
						events={events}
						eventClick={this.handleEventClick}
						eventDrop={this.handleEventDrop}
						eventResize={this.handleEventResize}
						locale={t('key')}
					/>
				</Container>
			</div>
		);
	},
});

const mapStateToProps = state => ({
	events: state.lists.items,
	loading: state.lists.loading,
});

const mapDispatchToProps = {
	setFilter, 
	clearAllFilters,
	setActiveColumns,
};

export default translate(['init', 'calendar'])(connect(mapStateToProps, mapDispatchToProps)(CalendarView));