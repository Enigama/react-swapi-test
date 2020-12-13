import React, {useState} from "react";
import './header.sass';
import fb from "./facebook.svg";
import home from "./home.svg";
import {Link} from "react-router-dom";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Header = () => {
	const [user, setUser] = useState(null);

	const responseFacebook = user => {
		setUser(user);
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="custom-container d-flex justify-content-between">
				{
					user ?
						<div className="align-start">
							Hello {user.name}
						</div>
						:
						<FacebookLogin appId="462100531624118"
													 render={renderProps => (
														 <div className="header__link" onClick={renderProps.onClick}>
															 <img src={fb} alt="" width="24" height="24"
																		className="d-inline-block align-center header__icon"/>
															 Signin
														 </div>
													 )}
													 callback={responseFacebook}/>
				}
				<Link to='/' className="header__link">
					<img src={home} alt="" width="30" height="24"
							 className="d-inline-block align-center header__icon"/>
					Home
				</Link>
			</div>
		</nav>
	)
}

export default Header;
