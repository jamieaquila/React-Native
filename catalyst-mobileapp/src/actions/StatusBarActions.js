export function show() {
	return {
		type: 'STATUS_BAR_SHOW',
		hidden: false
	}
}

export function hide() {
	return {
		type: 'STATUS_BAR_HIDE',
		hidden: true
	}
}

export function setStyle(style) {
	return {
		type: 'STATUS_BAR_SET_STYLE',
		style: style
	}
}