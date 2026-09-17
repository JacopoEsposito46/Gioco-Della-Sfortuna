import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import DefaultLayout from "./components/DefaultLayout";
import Home from "./components/Home";
import Game from "./components/Game";
import NotFound from "./components/NotFound";
import API from "./api/API"; // Assuming you have an API module for handling requests
import Rules from "./components/Rules";
import { useNavigate } from "react-router";
import History from "./components/History";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try{
        const user = await API.getUserInfo(); // we have the user info here
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        setLoggedIn(false);
        setUser("");
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: "success" });
      setUser(user);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage("");
    navigate("/");
  };

  return (
    <Routes>
      <Route element={<DefaultLayout loggedIn={loggedIn} handleLogout={handleLogout} message={message} setMessage={setMessage} handleLogin={handleLogin} handleShow={handleShow} handleClose={handleClose} show={show} /> }>
        <Route path="/" element={ <Home loggedIn={loggedIn} handleShow={handleShow}/> } />
        <Route path="/rules" element={ <Rules/> } />
        <Route path="/game" element={ <Game demo={false}/> } />
        <Route path="/demo" element={ <Game demo={true}/> } />
        <Route path="/history" element={ loggedIn ? <History user={user}/> : <Navigate to="/" replace /> } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
