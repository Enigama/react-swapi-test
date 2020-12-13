import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Select from 'react-select';
import throttle from "lodash-es/throttle";

import "./Card.sass";
import Spinner from "../../components/spinner/Spinner";

const Main = () => {
	const API_URL = 'https://swapi.dev/api';
	const API_PLANET_URL = 'http://swapi.dev/api/planets';

	const [paginatorNext, setPaginatorNext] = useState('');
	const [endPaginator, setEndPaginator] = useState(false);
	const [people, setPeople] = useState([]);
	const [planetsIds, setPlanetsIds] = useState([]);
	const [planetsNames, setPlanetsNames] = useState([]);

	const changeSelect = (e) => {
		console.log(e);
	};

	const getSelectOptions = () => {
		return people.map(({name, url}) => ({value: name, label: name, charActerId: getIdFromUrl(url)}))
	};

	const getPlanet = (id) => {
		const notFoundPlanet = 'not found';

		const planet = planetsNames.find(({name, url}) => {
			return getIdFromUrl(url) === id
		});

		if (!planet) return notFoundPlanet;
		const {name} = planet;

		if (!name) return notFoundPlanet;
		return name
	};

	const getIdFromUrl = url => {
		const params = url.split('/');
		return Number(params[params.length - 2]);
	};

	const getUniqPlanet = (prevPlanetsIds, id) => {
		if (!prevPlanetsIds.length) return false;

		return prevPlanetsIds.some(pId => {
			return pId === id
		})
	};

	const loadCharActers = url => {
		console.log('load');
		if (endPaginator) return;

		axios(url)
			.then(({data}) => {
				if (!data.results) return;

				const {results, next} = data;
				if (!next) setEndPaginator(true);

				setPeople((prevState) => {
					return [...prevState, ...results]
				});
				setPaginatorNext(next)
			})
			.catch(error => {
				console.log(error);
			})
	};

	useEffect(() => {
		loadCharActers(`${API_URL}/people/`)
	}, []);

	useEffect(() => {
		if (!people.length) return;

		people.forEach(({homeworld}) => {
			if (!homeworld) return;

			const id = getIdFromUrl(homeworld);

			setPlanetsIds(prevState => {
				if (!getUniqPlanet(prevState, id)) {
					return [...prevState, id]
				}
				return prevState
			})
		})
	}, [people]);

	//todo fix error duplicate items after request!
	useEffect(() => {
		const promises = [];

		planetsIds.forEach(id => {
			if (planetsNames.some(({url}) => getIdFromUrl(url) !== id) || !planetsNames.length) {
				promises.push(axios(`${API_PLANET_URL}/${id}`));
			}
		});

		Promise.all(promises)
			.then((res) => {
				if (!res.length) return;

				res.forEach(({data}) => {
					const {name} = data;

					if (!name) {
						return;
					}
					setPlanetsNames((prevState) => {
						return [...prevState, {...data}]
					})
				})
			})
	}, [planetsIds]);

	return (
		<div className="main-page">
			<div className="main-page__container">
				<h3 className="card-headline">Characters list</h3>
				{
					people.length ?
						(
							<>
								<div className="card-search">
									<Select options={getSelectOptions()} onChange={changeSelect}/>
								</div>

								<PerfectScrollbar onYReachEnd={() => loadCharActers(paginatorNext)} className="card-list">
									{
										people.map(({name, gender, homeworld}, index) => (
											<a href="#" className="card card-link" key={name}>
												<div className="card-body">
													<h5 className="card-title">
														<span className="card-desc">name</span>: {name}
													</h5>
													<p className="card-content">
														<span className="card-desc">gender:</span> {gender}
													</p>
													<p className="card-content">
														<span className="card-desc">home world:</span> {getPlanet(getIdFromUrl(homeworld))}
													</p>
												</div>
											</a>
										))
									}
								</PerfectScrollbar>
							</>
						)
						:
						<Spinner/>
				}
			</div>
		</div>
	)
};

export default Main;
