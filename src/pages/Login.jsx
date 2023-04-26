import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { emailLogin, nameLogin, tokenLogin } from '../redux/actions';
import { fetchToken } from '../services/fetchApi';
import '../styles/Login.css';
import titleLogo from '../images/Trivia-logo-01-final.svg';

class Login extends Component {
  state = {
    nameUser: '',
    emailUser: '',
    disable: true,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.validateField);
  };

  validateField = () => {
    const { nameUser, emailUser } = this.state;
    const verifyName = nameUser.length > 0;
    const regex = /^[\w-]+(.[\w-]+)*@([\w-]+.)+[a-zA-Z]{2,7}$/;
    const verifyEmail = emailUser.match(regex);
    this.setState({ disable: !(verifyName && verifyEmail) });
  };

  handleClick = async (event) => {
    event.preventDefault();
    const { nameUser, emailUser } = this.state;
    const { history, dispatch } = this.props;

    dispatch(nameLogin(nameUser));
    dispatch(emailLogin(emailUser));

    const userTokenResponse = await fetchToken();

    dispatch(tokenLogin(userTokenResponse));
    localStorage.setItem('token', userTokenResponse);
    history.push('/game');
  };

  render() {
    const { nameUser, emailUser, disable } = this.state;
    const { history } = this.props;

    return (

      <div className="login-container">
        <div className="login-box">
          <img src={ titleLogo } alt="" width="300" />
          <form className="login-form">
            <label htmlFor="email">
              <input
                placeholder="What is your Gravatar e-mail?"
                type="email"
                name="emailUser"
                id="email"
                value={ emailUser }
                onChange={ this.handleChange }
                data-testid="input-gravatar-email"
              />
            </label>
            <label htmlFor="name">
              <input
                placeholder="What is your name?"
                type="name"
                name="nameUser"
                id="name"
                value={ nameUser }
                onChange={ this.handleChange }
                data-testid="input-player-name"
              />
            </label>
            <button
              type="submit"
              className="btn-play"
              onClick={ this.handleClick }
              disabled={ disable }
              data-testid="btn-play"
            >
              Play
            </button>
            <button
              className="btn-settings"
              data-testid="btn-settings"
              onClick={ () => history.push('/config') }
            >
              Settings
            </button>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Login);
