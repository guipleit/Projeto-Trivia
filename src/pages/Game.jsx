import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import he from 'he'; // Biblioteca para decodificar caracteres que vem em formato HTML
import { fetchQuestions } from '../services/fetchApi';
import Header from '../components/Header';
import { updateScore } from '../redux/actions';
import '../styles/Game.css';

class Game extends Component {
  state = {
    results: [],
    currentIndex: 0,
    clickedAnswer: null,
    timer: 30,
    shuffledAnswers: [],
    userCorrectAnswers: 0,
    userIncorrectAnswers: 0,
    nextButton: false,
  };

  componentDidMount() {
    const { history, name, settings } = this.props;
    if (!name || name === '') {
      history.push('/');
    }
    this.getResults();
    this.startTimer(settings.timerValue);
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  getResults = async () => {
    const { settings } = this.props;
    const response = await fetchQuestions(localStorage.getItem('token'), settings);
    const { history } = this.props;

    if (response.response_code !== 0) {
      localStorage.removeItem('token');
      history.push('/');
    } else {
      this.setState({ results: response.results }, () => {
        this.shuffleAnswers();
      });
    }
  };

  shuffleAnswers = () => {
    const { results, currentIndex } = this.state;
    const currentQuestion = results[currentIndex];

    if (currentQuestion) {
      const allAnswers = [
        { answer: currentQuestion.correct_answer, correct: true },
        ...currentQuestion.incorrect_answers.map((answer) => ({
          answer,
          correct: false,
        })),
      ];

      this.setState({ shuffledAnswers: this.randomArray(allAnswers) });
    }
  };

  randomArray = (array) => {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  handleClickedAnwers = (index) => {
    const {
      shuffledAnswers,
      timer,
      currentIndex,
      results,
      userCorrectAnswers,
      userIncorrectAnswers,
      clickedAnswer,
    } = this.state;

    if (clickedAnswer !== null) {
      return;
    }

    const { dispatch } = this.props;
    const answerObj = shuffledAnswers[index];
    const difficulty = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    const currentQuestion = results[currentIndex];
    const BASE_POINTS = 10;

    if (answerObj.correct) {
      const points = BASE_POINTS + timer * difficulty[currentQuestion.difficulty];
      this.setState({
        userCorrectAnswers: userCorrectAnswers + 1,
        nextButton: true,
      });
      dispatch(updateScore({ points, isCorrect: true }));
    } else {
      this.setState({
        userIncorrectAnswers: userIncorrectAnswers + 1,
        nextButton: true,
      });
      dispatch(updateScore({ points: 0, isCorrect: false }));
    }

    this.setState({ clickedAnswer: index, nextButton: true, timer: 0 });
  };

  startTimer = (timerValue) => {
    const ONE_SECOND_INTERVAL = 1000;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.setState({ timer: timerValue }, () => {
      this.timerInterval = setInterval(() => {
        this.setState((prevState) => {
          if (prevState.timer === 0) {
            clearInterval(this.timerInterval);
            return {
              timer: 0,
              userIncorrectAnswers: prevState.userIncorrectAnswers + 1,
              nextButton: true,
            };
          }
          return { timer: prevState.timer - 1 };
        });
      }, ONE_SECOND_INTERVAL);
    });
  };

  nextQuestion = () => {
    const { currentIndex, results } = this.state;
    const { settings } = this.props;
    this.setState(
      (prevState) => ({
        currentIndex: prevState.currentIndex + 1,
        clickedAnswer: null,
        timer: settings.timerValue,
        nextButton: false,
      }),
      () => {
        if (currentIndex === results.length - 1) {
          const { history } = this.props;
          history.push('/feedback');
        } else {
          this.shuffleAnswers();
          this.startTimer(settings.timerValue);
        }
      },
    );
  };

  render() {
    const {
      results,
      currentIndex,
      clickedAnswer,
      timer,
      shuffledAnswers,
      nextButton,
    } = this.state;
    const currentQuestion = results[currentIndex];
    const remainingQuestions = results.length - currentIndex;

    if (currentQuestion) {
      const decodedQuestionText = he.decode(currentQuestion.question);
      const mapAnswers = shuffledAnswers.map((answerObj, index) => {
        const decodedAnswerText = he.decode(answerObj.answer);
        let borderColor;

        if (clickedAnswer !== null || timer === 0) {
          if (answerObj.correct) {
            borderColor = '3px solid rgb(6, 240, 15)';
          } else {
            borderColor = '3px solid red';
          }
        }

        return (
          <button
            onClick={ () => this.handleClickedAnwers(index) }
            key={ index }
            disabled={ timer === 0 }
            data-testid={
              answerObj.correct
                ? 'correct-answer'
                : `wrong-answer-${index}`
            }
            style={ { border: borderColor } }
            className="answer-button"
          >
            {decodedAnswerText}
          </button>
        );
      });

      return (
        <div className="game-container">
          <Header />
          <div className="content-container">
            <h2 data-testid="question-category" className="question-category">
              {results[currentIndex]?.category}
            </h2>
            <p data-testid="question-text" className="question-text">
              {decodedQuestionText}
            </p>
            <div data-testid="answer-options" className="answer-options">
              {mapAnswers}
            </div>
            {nextButton && (
              <button
                data-testid="btn-next"
                onClick={ this.nextQuestion }
                className="btn-next"
              >
                Next
              </button>
            )}
            <p className="timer">
              Remaining time:
              {' '}
              <span className="timer-span">{timer}</span>
            </p>
            <p className="remaining-questions">
              Remaining Questions:
              {' '}
              <span className="remaining-questions-span">{remainingQuestions}</span>

            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <p>Loading...</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.player.name,
  settings: state.player.settings || {
    category: '9',
    difficulty: 'Any',
    type: 'Any',
    questionAmount: '5',
    timerValue: 30,
  },
});

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    questionAmount: PropTypes.number.isRequired,
    timerValue: PropTypes.number.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(Game);
