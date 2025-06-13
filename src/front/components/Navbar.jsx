import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light bg-gradient">
      <div className="">
        <div className="d-flex mx-5 align-items-center">
          <div className="d-flex justify-content-center align-items-center mx-2">
            
            <div className="navbar-brand" href="#">
              <Link to="/"> 
                <img src="logo.png" alt="" width="100" height="100" />
              </Link>
            </div>           
            
            <Link to="/actionGenre" >
              <button className="btn btn-light text-primary">
                Action <i className="fa-solid fa-gun"></i>
              </button>
            </Link>
            <Link to="/drama">
              <button className="btn btn-light text-primary">
                Drama <i className="fa-solid fa-heart-crack"></i>
              </button>
            </Link>
            <Link to="/comedy">
              <button className="btn btn-light text-primary">
                Comedy <i className="fa-solid fa-masks-theater"></i>
              </button>
            </Link>
            <Link>
              <button className="btn btn-light text-primary">
                {" "}
                Sports <i className="fa-solid fa-futbol"></i>
              </button>
            </Link>
            <Link to="/live">
              <button className="btn btn-light text-primary">
                Live TV <i className="fa-solid fa-tv"></i>
              </button>
            </Link>
            <Link>
              <button className="btn btn-light text-primary">
                My favorites <i className="fa-solid fa-star"></i>
              </button>
            </Link>
            
          </div>          

          <div className="d-flex align-items-center justify-content-end pl-0">
            <Link className="mx-1" to="/login">
              <button className="btn btn-light text-primary">Login</button>
            </Link>
            <Link className="mx-1" to="/signup">
              <button className="btn btn-light text-primary">Signup</button>
            </Link>           
            <Link className="mx-1" to="/">
              <button className="btn btn-light text-primary">
                <i className="fa-solid fa-house fa-xl"></i>{" "}
              </button>
            </Link>
            <input
              type="text"
              className="form-control search-input ms-2"
              placeholder="Search Binge Box"
            />
            <Link className="mx-1" to="/profile">
              <button className="btn btn-light text-primary">
                <i className="fa-solid fa-user fa-xl"></i>{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
