import React from "react";
import './header.sass';
import fb from "./facebook.svg";
import home from "./home.svg";
import {Link} from "react-router-dom";

const Header = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid justify-content-center">
				<div className="header__link">
					<img src={fb} alt="" width="30" height="24"
							 className="d-inline-block align-center"/>
					Signin
				</div>

				<Link to='/' className="header__link">
					<img src={home} alt="" width="30" height="24"
							 className="d-inline-block align-center"/>
					Home
				</Link>
			</div>
		</nav>
	)
}

export default Header;
