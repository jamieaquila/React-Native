import parseURLScheme from './parseURLScheme';
import timeAgo from './timeAgo';
import calculateConstrainedDimensions from './calculateConstrainedDimensions';
import titleCase from 'title-case';
import numeral from 'numeral';
import dateFormat from 'dateformat';
import uuid from 'uuid';
import truncateMiddle from 'truncate-middle';
import parseTemplate from 'curio';
import shuffleArray from 'array-shuffle';
import jwtDecode from 'jwt-decode';

var commaNumber = function (num) {
	return numeral(num).format('0,0')
}

var shortNumber = function (num) {
	return numeral(num).format('0.[0]a')
}

export {
	timeAgo,
	titleCase,
	shortNumber,
	parseURLScheme,
	dateFormat,
	uuid,
	commaNumber,
	truncateMiddle,
	parseTemplate,
	shuffleArray,
	jwtDecode,
	calculateConstrainedDimensions,

}
