import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  IoMdMenu,
  IoMdClose,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import UserProfileMenu from "./UserProfileMenu";
import ActionBtn from "./ActionBtn";
import { links } from "../data/data";

function Header() {
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState("JD");

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  const handleShowPersonMenu = () => {
    setShowMenu(!showMenu);
  };

  const token = localStorage.getItem("mb-token");
  const loggedInuser = localStorage.getItem("user");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      const who = loggedInuser
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("");
      setUser(who);
    }
  }, []);

  return (
    <Navbar expand="lg" className="bg-white header py-3 position-sticky top-0 ">
      <Container>
        <Navbar.Brand>
          <Link to="/">
            {" "}
            <img src={logo} alt="brand Logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}>
          {expanded ? <IoMdClose size={28} /> : <IoMdMenu size={28} />}
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-lg-flex gap-2 gap-lg-5 links">
            {links.map((link) => {
              return (
                <Link
                  key={link.id}
                  to={link.to}
                  className={
                    location.pathname === link.to
                      ? "fs-5 nav-link fw-medium mylinks action"
                      : "fs-5 nav-link fw-medium mylinks"
                  }
                >
                  {link.content}
                </Link>
              );
            })}
          </Nav>
          {isLoggedIn ? (
            <Nav className="position-relative logout ms-lg-auto d-flex flex-row gap-3">
              <div className="rounded-circle profile d-flex justify-content-center align-items-center">
                <h1 className="fs-5">{user}</h1>
              </div>
              <button
                className="bg-transparent border-0"
                onClick={handleShowPersonMenu}
              >
                {showMenu ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>

              {showMenu && (
                <div
                  style={{ top: "80px", left: "-10px" }}
                  className="position-absolute "
                >
                  <UserProfileMenu setIsLoggedIn={setIsLoggedIn} />
                </div>
              )}
            </Nav>
          ) : (
            <Nav className="ms-auto d-lg-flex gap-3">
              <Link
                to="/register"
                className=" fs-5 text-white text-decoration-none"
              >
                <ActionBtn
                  content="Sign up"
                  width={"146px"}
                  className="herobtn"
                />
              </Link>
              <Link to="/login" className="fs-5 text-dark text-decoration-none">
                <button
                  className="btn btn-outline-dark border-dark border-2"
                  style={{ width: "146px", height: "50px" }}
                >
                  Sign In
                </button>
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
