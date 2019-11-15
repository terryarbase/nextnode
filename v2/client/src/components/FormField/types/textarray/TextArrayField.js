import React from 'react';

import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

import {
	FormField,
} from '../../elemental';

export default Field.create({
	displayName: 'TextArrayField',
	statics: {
		type: 'TextArray',
	},
	mixins: [ArrayFieldMixin],
	renderUI () {
		return this.renderWithErrorUI();
	},
});
