/**
 * The Home view is the view one sees at /keystone. It shows a list of all lists,
 * grouped by their section.
 */

import React from 'react';
import { Container, Spinner, Grid } from '../../elemental';
import { connect } from 'react-redux';
import { translate } from "react-i18next";
import { Pie, Line, Polar, Bar } from 'react-chartjs-2';
import _ from 'lodash';

import Lists from './components/Lists';
import Section from './components/Section';
import AlertMessages from '../../shared/AlertMessages';
import {
	loadCounts,
	loadGenderStatistic,
	loadJoinStatistic,
} from './actions';

var HomeView = React.createClass({
	displayName: 'HomeView',
	getInitialState () {
		return {
			modalIsOpen: true,
		};
	},
	// When everything is rendered, start loading the item counts of the lists
	// from the API
	componentDidMount () {
		this.props.dispatch(loadCounts());
		this.props.dispatch(loadJoinStatistic());
		this.props.dispatch(loadGenderStatistic());
	},
	getSpinner () {
		if (this.props.counts && Object.keys(this.props.counts).length === 0
			&& (this.props.error || this.props.loading)) {
			return (
				<Spinner />
			);
		}
		return null;
	},
	renderTop5RestType() {
		const {
			t,
		} = this.props;
		const chartData = {
		  labels: [
		  	'韓國菜', 
		  	'台灣菜', 
		  	'西餐', 
		  	'日本菜', 
		  	'港式'
		  ],
		  datasets: [
		    {
		      label: t('dashboard:restaurantType'),
		      backgroundColor: 'rgba(255,99,132,0.2)',
		      borderColor: 'rgba(255,99,132,1)',
		      borderWidth: 1,
		      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
		      hoverBorderColor: 'rgba(255,99,132,1)',
		      data: [65, 59, 60, 81, 56]
		    }
		  ]
		};

		return (
			<div>
				<h2>{t('dashboard:restaurantTypeTitle')}</h2>
				<Bar data={chartData} />
			</div>
		);
	},
	renderTop10Rest() {
		const {
			t,
		} = this.props;
		const chartData = {
		  datasets: [{
		    data: [
		      50,
		      32,
		      19,
		      53,
		      26,
		      22,
		      43,
		      28,
		      33,
		      35,
		    ],
		    backgroundColor: [
		      '#FF6384',
		      '#4BC0C0',
		      '#FFCE56',
		      '#E7E9ED',
		      '#36A2EB',
		      '#7e4ea3',
		      '#5c877e',
		      '#482d91',
		      '#83b06a',
		      '#deb16d',
		    ],
		  }],
		  labels: [
		    '心之食堂 Love Cafe',
		    '鉄人旨花 Shika Teppan-Yaki',
		    'Diletto',
		    '七福神和食亭',
		    '漁獲浜燒 Toretore Hamayaki',
		    '和氣食堂 Waki Shokudo',
		    '阿來泰式地道風味',
		    '新泰東南亞餐廳',
		    'Vision 8',
		    '木船 Wooden boat',
		  ]
		};
		return (
			<div>
				<h2>{t('dashboard:restaurantTitle')}</h2>
				<Pie data={chartData} />
			</div>
		);
	},
	renderGenderChart() {
		const {
			genderStatistic,
			genderLoading,
			t,
		} = this.props;

		if (genderLoading) {
			return null;
		}

		const dataset =  _.reduce(genderStatistic, (s, gs) => {
			let target = _.capitalize(_.camelCase(_.toLower(gs.label)));
			if (!target) {
				target = 'Unknown';
			} else if (!_.includes([
				'Female',
				'Male',
			], target)) {
				target = 'NotToTell';
			}
			return {
				...s,
				[target]: (s[target] || 0) + gs.total, 
			}
		}, {});
		const {
			data,
			labels,
		} = _.reduce(dataset, (s, total, f) => {
			const label = t(`dashboard:gender${f}`);
			// console.log(f, labels, total);
			return {
				data: [ ...s.data, total ],
				labels: [ ...s.labels, label ],
			};
		}, {
			data: [],
			labels: [],
		});

		const chartData = {
			labels,
			datasets: [{
				data: _.values(data),
				backgroundColor: [ '#fcba03', '#06c436', '#702241', '#0a05a3' ],
				hoverBackgroundColor: [ '#fcba03', '#06c436', '#702241', '#0a05a3' ],
			}]
		};

		return (
			<div>
				<h2>{t('dashboard:genderTitle')}</h2>
				<Pie data={chartData} />
			</div>
		)
	},
	renderJoinChart() {
		const {
			joinStatistic,
			joinLoading,
			t,
		} = this.props;

		if (joinLoading) {
			return null;
		}

		const {
			data,
			labels,
		} = _.reduce(joinStatistic, (s, js) => {
			// console.log(js);
			return {
				data: [ ...s.data, js.total ],
				labels: [ ...s.labels, js.label ],
			};
		}, {
			data: [],
			labels: [],
		});
		// console.log(data, labels);
		const chartData = {
		  labels,
		  datasets: [
		    {
		      fill: false,
		      lineTension: 0.1,
		      backgroundColor: 'rgba(75,192,192,0.4)',
		      borderColor: 'rgba(75,192,192,1)',
		      borderCapStyle: 'butt',
		      borderDash: [],
		      label: t('dashboard:joinSubTitle'),
		      borderDashOffset: 0.0,
		      borderJoinStyle: 'miter',
		      pointBorderColor: 'rgba(75,192,192,1)',
		      pointBackgroundColor: '#fff',
		      pointBorderWidth: 1,
		      pointHoverRadius: 5,
		      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
		      pointHoverBorderColor: 'rgba(220,220,220,1)',
		      pointHoverBorderWidth: 2,
		      pointRadius: 1,
		      pointHitRadius: 10,
		      data,
		    }
		  ]
		};
		return (
			<div>
				<h2>{t('dashboard:joinTitle')}</h2>
				<Line data={chartData} />
			</div>
		)
	},
	render () {
		const spinner = this.getSpinner();
		const { t } = this.props;
		return (
			<Container data-screen-id="home">
				{
					/* <div className="dashboard-header">
						<div className="dashboard-heading">{Keystone.brand}</div>
					</div> */
				}
				<div className="dashboard-header">
					<Grid.Row>
						<Grid.Col large="one-half">
				        	{this.renderGenderChart()}
				        </Grid.Col>
				        <Grid.Col large="one-half">
				        	{this.renderJoinChart()}
				        </Grid.Col>
				    </Grid.Row>
				    <br /><br />
				    <Grid.Row>
				        <Grid.Col large="one-half">
				        	{this.renderTop5RestType()}
				        </Grid.Col>
				        <Grid.Col large="one-half">
				        	{this.renderTop10Rest()}
				        </Grid.Col>
				    </Grid.Row>
			    </div>
				<div className="dashboard-groups">
					{(this.props.error) && (
						<AlertMessages
							alerts={
								{ 
									error: { 
										error: t('networkError'),
									},
								}
							}
							t={t}
						/>
					)}
					{/* Render flat nav */}
					{Keystone.nav.flat ? (
						<Lists
							counts={this.props.counts}
							lists={Keystone.lists}
							spinner={spinner}
							t={t}
						/>
					) : (
						<div>
							{/* Render nav with sections */}
							{Keystone.nav.sections.map((navSection) => {
								return (
									<Section t={t}
										key={navSection.key}
										id={navSection.key} 
										label={t(`nav:section_${navSection.key}`)}>
										<Lists
											counts={this.props.counts}
											lists={navSection.lists}
											spinner={spinner}
											t={t}
										/>
									</Section>
								);
							})}
							{/* Render orphaned lists */}
							{Keystone.orphanedLists.length ? (
								<Section t={t} label={t('landing:other')} icon="octicon-database">
									<Lists
										counts={this.props.counts}
										lists={Keystone.orphanedLists}
										spinner={spinner}
										t={t}
									/>
								</Section>
							) : null}
						</div>
					)}
				</div>
			</Container>
		);
	},
});

export {
	HomeView,
};

export default translate(['message', 'dashboard', 'landing', 'form', 'nav'])(connect((state) => ({
	counts: state.home.counts,
	loading: state.home.loading,
	error: state.home.error,
	genderStatistic: state.home.genderStatistic,
	genderLoading: state.home.genderLoading,

	joinStatistic: state.home.joinStatistic,
	joinLoading: state.home.joinLoading,
}))(HomeView));
