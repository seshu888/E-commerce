import { createMuiTheme } from '@material-ui/core';
import 'typeface-muli';

import defaultTheme from './default';

const overrides = {
	typography: {
		htmlFontSize: 10,
		fontFamily: [ 'Muli', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif' ].join(','),
		h1: {
			fontSize: '3rem'
		},
		h2: {
			fontSize: '2rem'
		},
		h3: {
			fontSize: '1.64rem'
		},
		h4: {
			fontSize: '1.5rem'
		},
		h5: {
			fontSize: '1.285rem'
		},
		h6: {
			fontSize: '1.142rem'
		}
	}
};

export default {
	default: createMuiTheme({ ...defaultTheme, ...overrides })
};
