import React, { useEffect } from 'react';

import './App.css';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Layout/Header';
import Layout from './components/Layout';
import Home from './containers/Home';
import About from './containers/About';
import VerifyEmail from './containers/VerifyEmail';
import Login from './containers/Login';
import Loading from './containers/Login/Loading';
import Account from './containers/Account';
import FindSitter from './containers/FindSitter';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        cookies.get('sid') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') || 'en');
  }, []);

  return (
    <div className="App">
      <BrowserRouter basename={'/'}>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/find" component={FindSitter} />
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route path="/activate/:token?" component={VerifyEmail} />
            <PrivateRoute path="/account" component={Account} />
            <Route path="/loading" component={Loading} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
