import React from 'react';


	// function INR(value) {
	// 	var val = Math.abs(value)
	// 	if (val >= 10000000) {
	// 	  val = (val / 10000000).toFixed() + ' Cr';
	// 	} else if (val >= 100000) {
	// 	  val = (val / 100000).toFixed() + ' Lac';
	// 	}
	// 	return val;
	//   }
	
	
	function changeNumberFormat(number, decimals, recursiveCall) {
		const decimalPoints = decimals || 2;
		const noOfLakhs = number / 100000;
		let displayStr;
		let isPlural;
	
		// Rounds off digits to decimalPoints decimal places
		function roundOf(integer) {
			return +integer.toLocaleString(undefined, {
				minimumFractionDigits: decimalPoints,
				maximumFractionDigits: decimalPoints,
			});
		}
	
		if (noOfLakhs >= 1 && noOfLakhs <= 99) {
			const lakhs = roundOf(noOfLakhs);
			isPlural = lakhs > 1 && !recursiveCall;
			displayStr = `${lakhs} Lakh${isPlural ? 's' : ''}`;
		} else if (noOfLakhs >= 100) {
			const crores = roundOf(noOfLakhs / 100);
			const crorePrefix = crores >= 100000 ? changeNumberFormat(crores, decimals, true) : crores;
			isPlural = crores > 1 && !recursiveCall;
			displayStr = `${crorePrefix} Crore${isPlural ? 's' : ''}`;
		} else {
			displayStr = roundOf(+number);
		}
	
		return displayStr;
	}

// function INR(input) {
// 	const rupees = Number(parseInt(input, 10));
// 	const output = [];

// 	if (rupees === 0) {
// 		output.push('zero');
// 	} else if (rupees === 1) {
// 		output.push('one');
// 	} else {
// 		const crores = Math.floor(rupees / 10000000) % 100;
// 		if (crores > 0) {
// 			output.push(getHundreds(crores) + (crores > 1 ? ' Crs' : ' Crs'));
// 		}
// 		const lakhs = Math.floor(rupees / 100000) % 100;
// 		if (lakhs > 0) {
// 			output.push(getHundreds(lakhs) + (lakhs > 1 ? ' Lac' : ' '));
// 		}
// 		const thousands = Math.floor(rupees / 1000) % 100;
// 		if (thousands > 0) {
// 			output.push(getHundreds(thousands) + ' K');
// 		}
// 		const hundreds = Math.floor((rupees % 1000) / 100);
// 		if (hundreds > 0 && hundreds < 10) {
// 			output.push(getOnes(hundreds) + ' hundred');
// 		}
// 		const tens = rupees % 100;
// 		if (tens > 0) {
// 			output.push(getHundreds(tens));
// 		}
//     output.push('rupees')
// 	}
// 	return [ ...output ]
// 		.join(' ')
// 		.split(/\s/)
// 		.filter((e) => e)
// 		.map((e) => e.substr(0, 1).toUpperCase() + e.substr(1))
// 		.join(' ');
// }

// function getOnes(number) {
// 	const ones = [ '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];
// 	return ones[number] || '';
// }
// function getTeens(number) {
// 	const teens = [
// 		'ten',
// 		'eleven',
// 		'twelve',
// 		'thirteen',
// 		'fourteen',
// 		'fifteen',
// 		'sixteen',
// 		'seventeen',
// 		'eighteen',
// 		'nineteen'
// 	];
// 	return teens[number] || '';
// }
// function getTens(number) {
// 	const tens = [ '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ];
// 	return tens[number] || '';
// }
// function getHundreds(num) {
// 	if (num > 0 && num < 10) {
// 		return getOnes(num);
// 	}
// 	if (num >= 10 && num < 20) {
// 		return getTeens(num % 10);
// 	}
// 	if (num >= 20 && num < 100) {
// 		return `${getTens(Math.floor(num / 10))} ${getOnes(num % 10)}`;
// 	}
// 	return '';
// }

const Currency = (props) => {
	let value = Number(props.value);
	 if (value >= 10000000) {
	 	return <span>{changeNumberFormat(value)}</span>;
	 } else {
    //  OSREC.CurrencyFormatter.format(2534234, { currency: 'INR' })
		return <span>{'₹' +(Number(value.toFixed(0)).toLocaleString('en-IN'))}</span>;
	 }
};
export default Currency;
