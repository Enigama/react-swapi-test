import React, {useState, useEffect} from "react";
import axios from 'axios';

import {PEOPLE_URL} from "../../constant/API_URLS";

import "./index.sass";

const CharActer = ({match}) => {
	const [charActer, setCharActer] = useState(null);

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

						<div className="character__row">{homeworld}</div>
						<div className="character__row">{vehicles}</div>
						<div className="character__row">{films}</div>
					</div>
				</div>
			</div>
		)
	};

	useEffect(() => {
		if (!match.params.slug) return;

		axios(`${PEOPLE_URL}${match.params.slug}`)
			.then(({data}) => {
				setCharActer(data)
			})
	}, []);

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
