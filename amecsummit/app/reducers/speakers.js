
const initialState = {
    speakers: [],
};
const speakers = (state=initialState, action) => {
    switch (action.type) {
        case 'SPEAKERS':
            return {
                ...state,
                speakers: action.speakers,
            }

        default:
            return state
    }
}

export default speakers;
