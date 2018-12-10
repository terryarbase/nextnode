import React, { PropTypes } from 'react';
import { Alert } from "react-bootstrap";
import { translate } from "react-i18next";
import _ from 'lodash';

import {
	Button,
	GlyphButton,
	Container,
} from '../../../elemental';

const NoListView = React.createClass({
	contextTypes: {
		items: React.PropTypes.object,
		isOpen: React.PropTypes.bool,
		list: React.PropTypes.object,
		router: React.PropTypes.object.isRequired,
		onCreate: React.PropTypes.func,
	},
	render() {
		const { t, list } = this.props;
		const listName = t(`form:table_${list.key}`);
		return (
			<Container style={{ paddingTop: '2em' }}>
				<Alert bsStyle={ list.nocreate ? 'danger' : 'warning' }>
					<h2>{t('nolistHeader', { listName })}</h2>
					<p>
						{t('nolistDesc', { listName })}
					</p>
					<p>
						<GlyphButton
							color={list.nocreate ? 'danger' : 'success'}
							disabled={list.nocreate}
							glyph="plus"
							position="left"
							onClick={this.props.onCreate}
							data-e2e-list-create-button="no-results"
						>
							{t('form:create')}
						</GlyphButton>
					</p>
				</Alert>
			</Container>
		);
	},
});

export default translate(['manage', 'form'])(NoListView);
