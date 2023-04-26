import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RankingCard from '../components/RankingCard';
import { resetState } from '../redux/actions';
import '../styles/Ranking.css';

class Ranking extends Component {
  restartGame = () => {
    const { history, dispatch } = this.props;
    history.push('/');
    dispatch(resetState());
  };

  render() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    const sortedRanking = ranking.sort((a, b) => Number(b.score) - Number(a.score));

    const mapRanking = sortedRanking.map((player, index) => (
      <RankingCard
        key={ index }
        name={ player.name }
        email={ player.email }
        score={ player.score }
        index={ index }
      />
    ));

    return (
      <>
        <div className="title-container">
          <div className="ranking-title" data-testid="ranking-title">Ranking</div>
        </div>
        <div className="ranking-container">
          {mapRanking}
        </div>
        <div className="button-container">
          <button
            onClick={ this.restartGame }
            className="btn-play-ranking"
            data-testid="btn-go-home"
          >
            Play again
          </button>
        </div>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Ranking);
