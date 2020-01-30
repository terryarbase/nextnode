import React from 'react';
import Summary from './summary'

var CustomView = React.createClass({
	displayName: 'CustomView',
	render () {
		switch(this.props.customKey) {
            case 'summary': {
                return <Summary {...this.props}/>
            }
            default: {
                return (
                    <div>nothing</div>
                )
            }
        }
	},
});

module.exports = CustomView
