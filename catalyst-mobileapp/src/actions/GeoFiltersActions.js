import { AsyncStorage } from 'react-native';
import { api, app } from '../config'
import { parseTemplate } from '../helpers'


export function geoFilterPostcall(userId,geofilterID,activityType) {
    // console.log('the data is',userId,geofilterID)
	var action = (dispatch, getState) => {
        const params = {
            user:userId,
            geofilterID:geofilterID,
            activityType:activityType
        }
        const appId = app.id;
        
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': (auth) ? 'Bearer ' + auth.accessToken : ''
				}
			}
			const request = {
				url: api.baseURL + '/GeoFiltersUsers?geofilterID=' + geofilterID ,
                method: 'put',
                body: JSON.stringify(params)
			}

            fetch(request.url, {...defaults, ...request})
			.then(res => { 
				if (res.ok) {
					res.json()
					.then(data => {
						console.log(res)
					})
				} else if (res.status === 401) {
					console.log(res.err)
				} else {
					console.log(res.err)
					
				}
			})
			.catch(error => {
				
				console.log(error);

				return false;
			});

		});
	}

	return action;
}