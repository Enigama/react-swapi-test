import React, {useState, useEffect} from "react";
import axios from 'axios';

import usePlanet from "../../hooks/usePlanet";
import {PEOPLE_URL} from "../../constant/API_URLS";

import "./index.sass";
import Spinner from "../../components/spinner/Spinner";

const CharActer = ({match}) => {
  const charActerId = match.params.slug;
  const [charActer, setCharActer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCharActer, setErrorCharActer] = useState(false);
  const [{planet}, doPlanet] = usePlanet(charActerId);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [filmsList, setFilmsList] = useState([]);

  useEffect(() => {
    if (!charActerId) return;
    const source = axios.CancelToken.source();
    setIsLoading(true);

    axios(`${PEOPLE_URL}${charActerId}`, {
      cancelToken: source.token
    })
      .then(({data}) => {
        setCharActer(data);
      })
      .catch(({response: {data: {detail}}}) => {
        console.log(detail, 'error response');
        setErrorCharActer(detail)
      })
      .finally(() => setIsLoading(false));

    return () => source.cancel();
  }, [charActerId]);

  useEffect(() => {
    if (!charActer) return;

    const {homeworld} = charActer;
    let mounted = true;

    if (homeworld && mounted) {
      doPlanet();
    }

    return () => mounted = false;
  }, [charActer, doPlanet]);

  useEffect(() => {
    if (!charActer) return;

    const source = axios.CancelToken.source();
    const {vehicles, films} = charActer;

    if (vehicles) {
      const promises = [];

      vehicles.forEach(url => {
        promises.push(axios(url, {
          cancelToken: source.token
        }))
      });

      Promise.all(promises)
        .then(res => {
          res.forEach(({data}) => {
            const {name, model} = data;
            setVehiclesList(prevState => [...prevState, {name, model}])
          })
        })
    }

    if (films) {
      const promises = [];

      films.forEach(url => {
        promises.push(axios(url, {
          cancelToken: source.token
        }))
      });

      Promise.all(promises)
        .then(res => {
          res.forEach(({data}) => {
            setFilmsList(prevState => [...prevState, data])
          })
        })
    }

    return () => source.cancel();
  }, [charActer]);

  const CharActerInfo = () => {
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
    } = charActer;
    return (
      <div className="character__body">
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
                  skin color: <span style={{
                  color: skin_color,
                  backgroundColor: skin_color === 'white' ? '#d0d0d0' : 'transparent'
                }}>{skin_color}</span>
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
                vehiclesList.length ?
                  <div className="character__row">
                    vehicles
                    {
                      vehiclesList.map(({name, model}) => (
                        <div key={name}>
                          <div>name: {name}</div>
                          <div>model: {model}</div>
                        </div>
                      ))
                    }
                  </div>
                  :
                  null
              }
              <div className="character__row">
                films: {
                filmsList.map(({title}, index) => (
                    <span key={title}>
										{title}{(index !== filmsList.length - 1) ? ', ' : null}
									</span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="character">
      <div className="custom-container">
        {isLoading && <Spinner/>}
        {charActer ?
          <CharActerInfo/>
          :
          errorCharActer && (
            <div className="character__not-found text-center">
              Sorry, character is {errorCharActer}
            </div>
          )
        }
      </div>
    </div>
  )
};

export default CharActer;
