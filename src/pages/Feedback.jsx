import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { updateRanking, resetState } from '../redux/actions';
import '../styles/Feedback.css';

class Feedback extends Component {
  componentDidMount() {
    const { player, dispatch } = this.props;
    dispatch(updateRanking(player));

    if (player.name === '') {
      const { history } = this.props;
      history.push('/');
      return;
    }

    const existingRanking = JSON.parse(localStorage.getItem('ranking')) || [];

    const updatedPlayer = {
      index: existingRanking.length,
      name: player.name,
      assertions: player.assertions,
      score: player.score,
      email: player.email,
    };

    const updatedRanking = [...existingRanking, updatedPlayer];
    localStorage.setItem('ranking', JSON.stringify(updatedRanking));
  }

  restartGame = () => {
    const { history, dispatch } = this.props;
    history.push('/');
    dispatch(resetState());
  };

  render() {
    const { history, player } = this.props;
    const { score, assertions } = player;

    const minAnswers = 3;

    const successFeedback = (
      <p>Well Done!</p>
    );

    const failureFeedback = (
      <p>Could be better...</p>
    );

    return (
      <div>
        <Header />
        <div className="feedback-container">
          <p data-testid="feedback-total-question">
            Correct questions:
            {' '}
            { assertions }
          </p>
          <p data-testid="feedback-total-score">
            Total Score:
            {' '}
            { score }

          </p>
          <div
            data-testid="feedback-text"
          >
            { assertions >= minAnswers ? successFeedback : failureFeedback }
          </div>
          <button
            className="btn-play-again"
            data-testid="btn-play-again"
            onClick={ this.restartGame }
          >
            Play again

          </button>
          <button
            className="btn-ranking"
            data-testid="btn-ranking"
            onClick={ () => history.push('/ranking') }
          >
            Ranking
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // assertions: state.player.assertions,
  // score: state.player.score,
  player: state.player,
});

Feedback.propTypes = {
  // assertions: PropTypes.number.isRequired,
  // score: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    assertions: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Feedback);
