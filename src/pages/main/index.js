import React, {useState, useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import axios from 'axios';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Select from 'react-select';
import debounce from "lodash-es/debounce";

import "./Card.sass";
import Spinner from "../../components/spinner/Spinner";
import {PEOPLE_URL, PLANET_URL} from "../../constant/API_URLS";
import {CHAR_ACTER_URL} from "../../constant/ROUTE_NAMES";

const Main = () => {
	let history = useHistory();
	const [paginatorNext, setPaginatorNext] = useState('');
	const [endPaginator, setEndPaginator] = useState(false);
	const [people, setPeople] = useState([]);
	const [planetsIds, setPlanetsIds] = useState([]);
	const [planetsNames, setPlanetsNames] = useState([]);

	const changeSelect = ({charActerId}) => {
		history.push(`${CHAR_ACTER_URL}/${charActerId}`)
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

	const loadCharActers = debounce(url => {
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
	}, 300);

	useEffect(() => {
		loadCharActers(PEOPLE_URL)
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
				promises.push(axios(`${PLANET_URL}/${id}`));
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
			<div className="custom-container">
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
										people.map(({name, gender, homeworld, url}, index) => (
											<Link to={`${CHAR_ACTER_URL}/${getIdFromUrl(url)}`} className="card card-link" key={name}>
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
											</Link>
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
