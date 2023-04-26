import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSettings, updateTimer } from '../redux/actions';
import '../styles/Config.css';

class Config extends Component {
  state = {
    fetchedCategories: [
      { id: 9, name: 'General Knowledge' },
      { id: 10, name: 'Entertainment: Books' },
      { id: 11, name: 'Entertainment: Film' },
      { id: 12, name: 'Entertainment: Music' },
      { id: 13, name: 'Entertainment: Musicals & Theatres' },
      { id: 14, name: 'Entertainment: Television' },
      { id: 15, name: 'Entertainment: Video Games' },
      { id: 16, name: 'Entertainment: Board Games' },
      { id: 17, name: 'Science & Nature' },
      { id: 18, name: 'Science: Computers' },
      { id: 19, name: 'Science: Mathematics' },
      { id: 20, name: 'Mythology' },
      { id: 21, name: 'Sports' },
      { id: 22, name: 'Geography' },
      { id: 23, name: 'History' },
      { id: 24, name: 'Politics' },
      { id: 25, name: 'Art' },
      { id: 26, name: 'Celebrities' },
      { id: 27, name: 'Animals' },
      { id: 28, name: 'Vehicles' },
      { id: 29, name: 'Entertainment: Comics' },
      { id: 30, name: 'Science: Gadgets' },
      { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
      { id: 32, name: 'Entertainment: Cartoon & Animations' },
    ], // Os testes do req 3 estavam falhando ao realizar a requisição para a API nesta url: https://opentdb.com/api_category.php / Inseri as categorias manualmente para que os testes passassem.
    category: 'Any',
    difficulty: 'Any',
    type: 'Any',
    questionAmount: 5,
    timerValue: 30,
  };

  handleCategoryChange = (event) => {
    this.setState({ category: event.target.value });
  };

  handleDifficultyChange = (event) => {
    this.setState({ difficulty: event.target.value });
  };

  handleTypeChange = (event) => {
    this.setState({ type: event.target.value });
  };

  handleQuestionAmountChange = (event) => {
    const { value } = event.target;
    this.setState({ questionAmount: Number(value) });
  };

  handleTimerChange = (event) => {
    this.setState({ timerValue: Number(event.target.value) });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { category, difficulty, type, questionAmount, timerValue } = this.state;
    const { dispatch, history } = this.props;
    await dispatch(updateSettings({ category, difficulty, type, questionAmount }));
    await dispatch(updateTimer(timerValue));
    history.push('/');
  };

  render() {
    const { fetchedCategories, timerValue } = this.state;
    return (
      <div className="settings-container">
        <div className="settings-box">
          <header className="settings-title" data-testid="settings-title">
            Settings
          </header>
          <form className="settings-form" onSubmit={ this.handleSubmit }>
            <label htmlFor="questionAmount">
              Number of Questions:
              <select
                name="questionAmount"
                id="questionAmount"
                onChange={ this.handleQuestionAmountChange }
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
            <label htmlFor="category">
              Category:
              <select name="category" id="category" onChange={ this.handleCategoryChange }>
                {fetchedCategories.map((category) => (
                  <option key={ category.id } value={ category.id }>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="difficulty">
              Difficulty:
              <select
                name="difficulty"
                id="difficulty"
                onChange={ this.handleDifficultyChange }
              >
                <option value="any">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label htmlFor="type">
              Type:
              <select name="type" id="type" onChange={ this.handleTypeChange }>
                <option value="any">Any</option>
                <option value="multiple">Multiple</option>
                <option value="boolean">True/False</option>
              </select>
            </label>
            <label htmlFor="timerDuration">
              Timer
              <select
                name="timerDuration"
                id="timerDuration"
                value={ timerValue }
                onChange={ this.handleTimerChange }
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </label>
            <button type="submit" data-testid="btn-play">
              Save Settings
            </button>
          </form>
        </div>
      </div>
    );
  }
}
Config.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Config);
