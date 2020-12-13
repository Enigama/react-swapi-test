import React from "react";
import './header.sass';
import fb from "./facebook.svg";

const Header = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid justify-content-center">
				<a className="header__link" href="#">
					<img src={fb} alt="" width="30" height="24"
							 className="d-inline-block align-center"/>
					Signin
				</a>
			</div>
		</nav>
	)
}

export default Header;
