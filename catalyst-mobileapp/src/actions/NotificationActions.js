export function show(content) {

	return {
		type: 'NOTIFICATION_SHOW',
		message: content.message? content.message : '',
		data: content.data? content.data : {}

	}
}	

export function shown() {
	return {
		type: 'NOTIFICATION_SHOWN'
	}
}