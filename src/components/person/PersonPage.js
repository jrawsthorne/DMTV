import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/mediaActions';
import BodyShort from '../post/BodyShort';
import { getPerson, getPersonState } from '../../reducers';
import './PersonPage.less';
import KnownFor from './KnownFor';
import Credits from './Credits';

import Loading from '../misc/Loading';

class PersonPage extends React.Component {
  componentDidMount() {
    const { match: { params: { id } }, fetchActor, actor } = this.props;
    if (_.isEmpty(actor)) {
      fetchActor(id);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      match: { url: currentURL, params: { id } }, actor, fetchActor, fetching, loaded,
    } = this.props;
    if ((!fetching && !loaded) || (_.isEmpty(actor) && currentURL !== prevProps.match.url)) {
      fetchActor(id);
    }
  }
  render() {
    const {
      actor, loaded, fetching, failed,
    } = this.props;
    if (!loaded || fetching) return <Loading />;
    if (failed) return <div className="main-content">Sorry, there was an error fetching that person</div>;
    return (
      <Layout className="main-content PersonPage">
        <div className="PersonPage__info">
          <h1>{actor.name}</h1>
          <div className="PersonPage__info__biography">{<BodyShort length={400} body={actor.biography} />}</div>
        </div>
        <h2>Known For</h2>
        <KnownFor list={actor.known_for} />
        <h2>More</h2>
        <div className="PersonPage__credits">
          <div className="PersonPage__credits__layout">
            <Credits list={actor.combined_credits} />
          </div>
        </div>
      </Layout>
    );
  }
}

PersonPage.propTypes = {
  actor: PropTypes.PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  fetchActor: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  actor: getPerson(state, ownProps.match.params.id),
  ...getPersonState(state, ownProps.match.params.id),
});

export default connect(mapStateToProps, { fetchActor: actions.fetchActor })(PersonPage);
