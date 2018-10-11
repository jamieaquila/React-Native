import queryString from 'query-string';

export default function parseURLScheme(url) {
	var matches = url.match(/:\/\/([^?]*)(?:\?(.*))?/);
	matches.shift();

	return {
		path: (matches[0]) ? '/' + matches[0] : '',
		query: (matches[1]) ? queryString.parse(matches[1]) : ''
	}
}