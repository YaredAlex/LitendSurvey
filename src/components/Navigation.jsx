import { useState } from "react";
import "./navigation.css";
import { Link } from "react-router-dom";
const Navigation = () => {
  const [toggle, setToggle] = useState(false);
  const shownav = () => {
    setToggle(!toggle);
    console.log(toggle);
  };
  return (
    <div>
      <div className="container-fluid border border-1 border-primary  d-flex gap-5 align-items-center">
        <div className="logo h2 text-primary">Litend</div>
        <div
          className={`nav-wrapper  d-md-block ${toggle ? "nav-active" : ""}`}
        >
          <ul className={`nav-ul-list d-flex gap-4 align-items-center`}>
            <li className="p-2">
              <Link to={"/"} className="btn btn-outline-secondary">
                {" "}
                Home
              </Link>
            </li>
            <li className="p-2">
              <Link to={"/make-pool"} className="btn btn-outline-secondary">
                Make Pool
              </Link>
            </li>
            <li className="p-2">
              <Link className="btn btn-outline-secondary">Servey</Link>
            </li>
          </ul>
        </div>
        {toggle ? (
          <div
            className="nav-toggler d-md-none d-block ms-auto z-3 btn btn-outline-warning"
            onClick={() => shownav()}
          >
            Hide
          </div>
        ) : (
          <div
            className="nav-toggler d-md-none d-block ms-auto z-3 btn btn-outline-secondary"
            onClick={() => shownav()}
          >
            show
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
