import React, { Component, Fragment } from "react";
import Hero from "./Hero";
import authConfig from "../auth_config.json";
import { Auth0ContextInterface, withAuth0 } from '@auth0/auth0-react';
import { Alert } from "reactstrap";

interface HomeProps {
  auth0: Auth0ContextInterface;
}

interface HomeState {
  currentUser: User;
  error: string;
  loading: boolean;
}

interface User {
  id: string;
  email: string;
}

class Home extends Component<HomeProps> {
  state = {
    currentUser: undefined,
    error: '',
    loading: false
  };

  componentDidMount () {
    const { isAuthenticated } = this.props.auth0;
    if (isAuthenticated) {
      this.getCurrentUserData();
    }
  }

  async getCurrentUserData () {
    this.setState({ loading: true, error: '' });

    const url = `${authConfig.apiBase}/current-user`;
    const getAccessTokenSilently = await this.props.auth0.getAccessTokenSilently();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAccessTokenSilently}`
      }
    });

    if (!response.ok) {
      const error = `An error has occured: ${response.status}`;
      this.setState({ error });
      return;
    }
  
    const { data } = await response.json();

    this.setState({ currentUser: data, loading: false });
  }

  render () {
    const { currentUser, error, loading } = this.state;
    return (
      <Fragment>
        <Hero />
        {loading &&
          <p className="text-center">Loading...</p>
        }
        {error &&
          <Alert color="danger">
            {error}  
          </Alert>
        }
        {currentUser &&
          <div className="text-center">
            {JSON.stringify(currentUser)}
          </div>
        }
      </Fragment>
    );
  }
}

export default withAuth0(Home);
