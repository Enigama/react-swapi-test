import {useEffect, useState} from "react";
import axios from 'axios';
import {PLANET_URL} from "../constant/API_URLS";

export default id => {
	const [planet, setPlanet] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const doPlanet = () => {
		//TODO optional add options for request
		setIsLoading(true)
	};

	useEffect(() => {
		if (!isLoading) return;
		const source = axios.CancelToken.source();

		axios(`${PLANET_URL}/${id}`, {
			cancelToken: source.token
		})
			.then(({data}) => {
				setPlanet(data);
				setIsLoading(false);
			})
			.catch(({response}) => {
				setError(response);
				setIsLoading(false);
			});

		return () => source.cancel()
	}, [id, isLoading]);

	return [{planet, error}, doPlanet]
}

