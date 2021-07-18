import React from 'react';
import classnames from 'classnames';

const LoaderComponent = ({ width, height, borderRadius, classes }) => {
	return (
		<div
			className={classnames('loaderCard', classes ? classes : '')}
			style={{ width: width, height: height, borderRadius: borderRadius ? borderRadius : 0 }}
		/>
	);
};
export default LoaderComponent;
