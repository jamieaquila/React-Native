export function getSpeakers(speakers) {
    return {
        type: 'SPEAKERS',
        speakers,
    }
}

export function getAgenda(agenda) {
    return {
        type: 'AGENDA',
        agenda,
    }
}
