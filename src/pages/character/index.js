import React, {useState, useEffect} from "react";
import axios from 'axios';

import usePlanet from "../../hooks/usePlanet";
import {PEOPLE_URL} from "../../constant/API_URLS";

import "./index.sass";

const CharActer = ({match}) => {
	const charActerId = match.params.slug;

	const [charActer, setCharActer] = useState(null);
	const [{planet, error}, doPlanet] = usePlanet(charActerId);

	useEffect(() => {
		if (!charActerId) return;

		axios(`${PEOPLE_URL}${charActerId}`)
			.then(({data}) => {
				setCharActer(data)
			})
	}, [charActerId]);

	useEffect(() => {
		if (!charActer) return;

		const {homeworld} = charActer;
		if (!homeworld) return;

		doPlanet();
	}, [charActer, doPlanet]);

	const showCharacter = () => {
		const {
			name,
			height,
			mass,
			hair_color,
			skin_color,
			eye_color,
			birth_year,
			gender,
			homeworld,
			vehicles,
			films
		} = charActer;
		return (
			<div className="character-block">
				<div className="card">
					<div className="card-body character__body">
						<h1 className="character__row character__name">{name}</h1>
						<div className="character__row">height: {height}</div>
						<div className="character__row">mass: {mass}</div>

						<div className="d-flex justify-content-center character__row">
							<div className="character__appearance">
								hair color: <span style={{color: hair_color}}>{hair_color}</span>
							</div>
							<div className="character__appearance">
								skin color: <span style={{color: skin_color}}>{skin_color}</span>
							</div>
							<div className="character__appearance">
								eye color: <span style={{color: eye_color}}>{eye_color}</span>
							</div>
						</div>

						<div className="character__row">birth year: {birth_year}</div>
						<div className="character__row">gender: {gender}</div>

						{
							homeworld && planet ?
								<div className="character__row"> home world: {planet.name}</div>
								:
								null
						}
						{
							vehicles ?
								<div className="character__row">{vehicles}</div>
								:
								null
						}
						<div className="character__row">{films}</div>
					</div>
				</div>
			</div>
		)
	};

	return (
		<div className="character">
			<div className="custom-container">
				{
					!charActer ?
						(
							<div className="character__not-found"></div>
						)
						:
						(
							<div className="character__body">
								{showCharacter()}
							</div>
						)
				}
			</div>
		</div>
	)
};

export default CharActer;
