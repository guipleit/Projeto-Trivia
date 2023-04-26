import React, { Component } from 'react';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import '../styles/Ranking.css';

class RankingCard extends Component {
  render() {
    const { name, email, score, index } = this.props;
    const hash = md5(email).toString();
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}`;

    return (
      <div className="ranking-card">
        <img className="ranking-card__image" src={ gravatarUrl } alt="Player" />
        <p
          className="ranking-card__name"
          data-testid={ `player-name-${index}` }
        >
          Name:
          {' '}
          {name}

        </p>
        <p
          className="ranking-card__score"
          data-testid={ `player-score-${index}` }
        >
          Score:
          {' '}
          {score}

        </p>
      </div>
    );
  }
}

RankingCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default RankingCard;
