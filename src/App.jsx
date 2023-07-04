import { createContext, useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./assets/css/index.css";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

// const variables
export const UserContext = createContext();

// import additional libraries
import { default as app } from "./lib/firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

// useContext
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import NavRoutes from "./components/routes/NavRoutes";
import NavigationSecondary from "./components/routes/NavigationSecondary";
import Navigation from "./components/routes/Navigation";
import { bem } from "./lib/bem";
import Footer from "./components/footer/Footer";

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  // setting the max width
  const maxWidth = 991; // less or equal

  // update screen width
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // verify the screen width - boolean
  const isMobile = width <= maxWidth;

  // set user
  const [user, setUser] = useState();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(JSON.parse(localStorage.getItem("user")));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="App">
      {/* <Container className="banner-container">
        <Container className="banner-image-tbd">
          <div className="banner-image-tbd__div">
            <img src="./logo.png" />
            <p className="banner-image-tbd__description">Phone accessories</p>
            <p>Coming soon</p>
          </div>
        </Container>
      </Container> */}
      <Container>
        <Container
          sticky="top"
          style={{ padding: "0" }}
          className={`${bem("navigation", "container")}`}
        >
          <Navigation />
          {isMobile ? null : <NavigationSecondary />}
        </Container>

        <Container className="main-container">
          <AuthProvider>
            <NavRoutes />
          </AuthProvider>
        </Container>
      </Container>
      <Container>
        <Footer />
      </Container>
    </div>
  );
}

export default App;
