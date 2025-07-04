import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<div >
					<Link to="/">
						<button className="btn btn-primary">Home</button>
					</Link>
					<Link to="/profile">
						<button className="btn btn-primary mx-2">Profile</button>
					</Link>
					{/* <ul className="dropdown-menu">
						{store.favorites?.length > 0 ? (
							store.favorites.map((item, index) => (
							<li key={index}>
								<a className="dropdown-item" href="#">{item}</a>
							</li>
							))
						) : (
							<li>
								<span className="dropdown-item-text">No favorites yet</span>
							</li>
						)}							
					</ul> */}
				</div>
				
					<div className="dropdown">
						<button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							<i className="fa-solid fa-bars"></i>
						</button>
						<ul className="dropdown-menu">
							Top Genres
							<li><a className="dropdown-item" href="#">Action</a></li>
							<li><a className="dropdown-item" href="#">Documentary</a></li>
							<li><a className="dropdown-item" href="#">TV Series</a></li>
							<li><a className="dropdown-item" href="#">Romance</a></li>
							<li><a className="dropdown-item" href="#">Comedy</a></li>
							<li><a className="dropdown-item" href="#">Sports</a></li>
							<li><a className="dropdown-item" href="#"></a></li>
							<li><a className="dropdown-item" href="#">Live TV <i className="fa-solid fa-tv"></i></a></li>
							<li><a className="dropdown-item" href="#">My Favorites <i className="fa-solid fa-star"></i></a></li>
							<li><a className="dropdown-item" href="#">Notifications <i className="fa-solid fa-bell"></i></a></li>
							<li><a className="dropdown-item" href="#">Settings <i className="fa-solid fa-gear"></i></a></li>
						</ul>
						<ul></ul>
					</div>				
				<h2>BINGE BOX</h2>
				<div className="ml-auto">
					<Link className="mx-2" to="/signup">
						<button className="btn btn-primary">Signup</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-primary">Login</button>
					</Link>
					<Link to="/demo">
						<button className="btn btn-primary">Home</button>
					</Link>
				</div>
			</div >
		</nav >
	);
};