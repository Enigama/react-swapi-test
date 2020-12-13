import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Select from 'react-select';
import difference from "lodash-es/difference";

import "./Card.sass";
import Spinner from "../../components/spinner/Spinner";
import {PEOPLE_URL, PLANET_URL} from "../../constant/API_URLS";
import {CHAR_ACTER_URL} from "../../constant/ROUTE_NAMES";

import {LikeIcon} from "../../components/icons/like";

const Main = () => {
	let history = useHistory();
	const [paginatorNext, setPaginatorNext] = useState('');
	const [endPaginator, setEndPaginator] = useState(false);
	const [people, setPeople] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [planetsIds, setPlanetsIds] = useState([]);
	const [planetsNames, setPlanetsNames] = useState([]);
	const [like, setLike] = useState([]);

	const updateLike = (characterId) => {
		if (!like.length) {
			setLike((prevState => [...prevState, {id: characterId}]));
			return
		}
		if (like.some(({id}) => id === characterId)) {
			const newLike = like.filter(({id}) => id !== characterId);
			setLike(newLike)
		} else {
			setLike((prevState => [...prevState, {id: characterId}]))
		}
	};

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

	const loadCharActers = url => {
		if (endPaginator || isLoading) return;
		setIsLoading(true);

		axios(url)
			.then(({data}) => {
				if (!data.results) return;

				const {results, next} = data;
				if (!next) {
					setEndPaginator(true)
				}
				setPaginatorNext(next);

				setPeople((prevState) => {
					return [...prevState, ...results]
				});

				setIsLoading(false);
			})
			.catch(error => {
				console.log(error);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		loadCharActers(PEOPLE_URL);
		const likes = JSON.parse(localStorage.getItem('like'));
		likes.forEach(({id}) => updateLike(id));
	}, []);

	useEffect(() => {
		if (!people.length) return;

		const homeWorldIds = [...new Set(people.map(({homeworld}) => getIdFromUrl(homeworld)))];

		setPlanetsIds((prevState => {
			return difference(homeWorldIds, prevState)
		}));
	}, [people]);

	useEffect(() => {
		const promises = [];
		const source = axios.CancelToken.source();

		planetsIds.forEach(id => {
			if (planetsNames.some(({url}) => getIdFromUrl(url) !== id) || !planetsNames.length) {
				promises.push(axios(`${PLANET_URL}/${id}`, {
					cancelToken: source.token
				}));
			}
		});

		Promise.all(promises)
			.then((res) => {
				if (!res.length) return;
				const planets = res.map(({data}) => data);

				setPlanetsNames((prevState) => {
					if (prevState !== planets) {
						return [...prevState, ...planets]
					}
					return prevState
				})
			});

		return () => source.cancel();
	}, [planetsIds]);

	useEffect(() => {
		localStorage.setItem("like", JSON.stringify(like))
	}, [like]);

	return (
		<div className="main-page">
			<div className="custom-container">
				<h3 className="card-headline">Characters list</h3>
				{
					people.length ?
						(
							<>
								<div className="card-search">
									<Select placeholder="Press character name" options={getSelectOptions()} onChange={changeSelect}/>
								</div>

								<PerfectScrollbar onYReachEnd={() => loadCharActers(paginatorNext)} className="card-list">
									{
										people.map(({name, gender, homeworld, url}, index) => (
											<div className="card" key={name}>
												<Link to={`${CHAR_ACTER_URL}/${getIdFromUrl(url)}`} className="card-link">
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
												<div className="card-like" onClick={() => updateLike(getIdFromUrl(url))}>
													<LikeIcon width={15} fill={like.some(({id}) => id === getIdFromUrl(url)) ? '#0d6efd' : '#000'}/>
												</div>
											</div>
										))
									}
									{isLoading ? <Spinner/> : null}
								</PerfectScrollbar>
							</>
						)
						:
						null
				}
			</div>
		</div>
	)
};

export default Main;
