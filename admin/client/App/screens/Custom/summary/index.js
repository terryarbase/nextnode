import React from 'react';
import _ from 'lodash';
// import { css } from 'glamor';
import { connect } from 'react-redux';
import { Fields } from 'FieldTypes';

import { Container } from '../../../elemental';

import {
	loadSummary,
} from '../actions';

var SummaryView = React.createClass({
    displayName: 'SummaryView',
    componentDidMount () {
		this.props.dispatch(loadSummary());
	},
    renderData (data) {
        return _.map(data, info => {
            const fieldProps = {
                ...info,
                // className: css(classes.formField),
                values: {
                    delegated: false,
                }
            }
            return React.createElement(Fields[info.type], fieldProps)
        })
    },
	render () {
        const {
            summary: {
                activatedMember = 'Loading',
                processingGift = 'Loading',
                processingWish = 'Loading',
                completedGift = 'Loading',
                completedWish = 'Loading',
            },
        } = this.props
        let data = [
            { type: 'text', label: 'Activated Member', noedit: true, value: activatedMember },
            { type: 'text', label: 'Processing Gift', noedit: true, value: processingGift },
            { type: 'text', label: 'Processing Wish', noedit: true, value: processingWish },
            { type: 'text', label: 'Completed Gift', noedit: true, value: completedGift },
            { type: 'text', label: 'Completed Wish', noedit: true, value: completedWish },
        ]
		return (
            <Container style={styles.container}>
                <h3 style={styles.header}>Summary</h3>
                {this.renderData(data)}
            </Container>
        )
	},
});

const styles = {
    container: {
        padding: '30px 20px',

    },
	header: {
        marginBottom: '30px',
	},
	// formField: {
    //     display: 'table',
    //     tableLayout: 'fixed',
    //     width: '100%',
	// },
	// label: {
	// 	display: 'table-cell',
    //     lineHeight: '2.3em',
    //     marginBottom: 0,
    //     paddingRight: '5px',
    //     verticalAlign: 'top',
    //     width: '180px',
	// },
};

module.exports = connect(state => {
    return {
        summary: state.custom.summary.data || {},
        loading: state.custom.summary.loading,
        error: state.custom.summary.error,
    }
})(SummaryView)