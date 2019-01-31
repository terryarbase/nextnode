import React, { PropTypes } from 'react';
import { Alert } from "react-bootstrap";
import { translate } from "react-i18next";
import moment from 'moment';

import FullCalendar from 'sardius-fullcalendar-wrapper';

import {
	Button,
	GlyphButton,
	Container,
} from '../../../elemental';

const CalendarView = React.createClass({
	contextTypes: {
		items: React.PropTypes.object,
		isOpen: React.PropTypes.bool,
		list: React.PropTypes.object,
		router: React.PropTypes.object.isRequired,
		onCreate: React.PropTypes.func,
	},
	getInitialState() {
		return {
			events: [
				{
					id: 0,
					title: 'All Day Event very long title',
					allday: true,
					start: moment().toDate(),
					end: moment().toDate(),
				},
				{
					id: 1,
					title: 'Test Full Calendar',
					allday: true,
					start: new Date(2019, 1, 2),
					end: new Date(2019, 1, 2),
				}
			]
		}
	},
	componentWillUnmount() {
		const { switchCalendarView } = this.props;
		switchCalendarView(false);
	},
	render() {
		const { t, list, renderHeader } = this.props;
		return (
			<div>
				{renderHeader()}
				<Container style={{ marginTop: `30px`, marginBottom: `30px` }}>
					<FullCalendar
						header={{
							left: 'prev, next today',
							center: 'title',
							right: 'month, agendaWeek, listDay'
						}}
						defaultDate={moment().format('YYYY-MM-DD')}
						editable
						selectable
						events={this.state.events}
						themeStyle={`bootstrap4`}
						locale={t('key')}
					/>
				</Container>
			</div>
		);
	},
});

export default translate(['init'])(CalendarView);