
const initialState = {
    agenda: [],
};
const agenda = (state=initialState, action) => {
    switch (action.type) {
        case 'AGENDA':
            return {
                ...state,
                agenda: action.agenda,
            }

        default:
            return state
    }
}

export default agenda;
