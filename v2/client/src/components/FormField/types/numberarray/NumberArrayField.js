// import PropTypes from 'prop-types';
import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

export default Field.create({

	displayName: 'NumberArrayField',
	statics: {
		type: 'NumberArray',
	},

	mixins: [ArrayFieldMixin],

	isValid (input) {
		return /^-?\d*\.?\d*$/.test(input);
	},
	renderUI () {
		return this.renderWithErrorUI();
	},
});
