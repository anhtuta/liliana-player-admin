import React, { Component } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { auth } from './components/Auth/Auth';
import PrivateRoute from './components/Auth/PrivateRoute';
import RestrictedRoute from './components/Auth/RestrictedRoute';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Song from './pages/Song/Song';
import NotFound from './pages/NotFound/NotFound';
import Nav from './components/Nav/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null
    };
  }

  componentDidMount() {
    const isAuthenticated = auth.isAuthenticated();
    if (isAuthenticated) {
      auth
        .getMe()
        .then((res) => {
          this.setState({
            userInfo: res.data
          });
        })
        .catch((err) => {
          console.log('Error: ', err);
        });
    }
  }

  render() {
    const { userInfo } = this.state;
    return (
      <HashRouter>
        <div className="app">
          <Nav userInfo={userInfo} />
          <div className="app-content">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/login"
                element={
                  <RestrictedRoute>
                    <Login />
                  </RestrictedRoute>
                }
              />
              <Route
                path="/song"
                element={
                  <PrivateRoute userInfo={userInfo}>
                    <Song />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </HashRouter>
    );
  }
}

export default App;
