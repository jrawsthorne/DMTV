import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/mediaActions';
import { SimilarItem } from '../media/Similar';
import BodyShort from '../post/BodyShort';
import './PersonPage.less';

import Loading from '../misc/Loading';

class PersonPage extends React.Component {
  componentDidMount() {
    const { match: { params: { id } }, fetchActor, actor } = this.props;
    if (_.isEmpty(actor)) {
      fetchActor(id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      match: { url: currentURL, params: { id } }, actor, fetchActor, fetching, loaded,
    } = nextProps;
    if ((!fetching && !loaded) || (_.isEmpty(actor) && currentURL !== this.props.match.url)) {
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
      <Layout className="main-content">
        <div className="PersonPage__info">
          <h1>{actor.name}</h1>
          <p>{<BodyShort length={400} body={actor.biography} />}</p>
        </div>
        <div className="PersonPageContainer">
          <div className="PersonPageLayout">
            {/* show backdrop, name and overview for each show/movie featured in */}
            {actor.combined_credits.map(item => (
              <div key={item.id} className="PersonPageLayout__preview">
                <SimilarItem
                  type={`${item.media_type === 'movie' ? 'movie' : 'show'}`}
                  item={item}
                  url={`/${item.media_type === 'movie' ? 'movie' : 'show'}/${item.id}`}
                />
              </div>
            ))}
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
  actor: _.get(state, `people.items[${ownProps.match.params.id}]`, {}),
  fetching: _.get(state, `people.itemStates[${ownProps.match.params.id}].fetching`, false),
  loaded: _.get(state, `people.itemStates[${ownProps.match.params.id}].loaded`, false),
  failed: _.get(state, `people.itemStates[${ownProps.match.params.id}].failed`, false),
});

export default connect(mapStateToProps, { fetchActor: actions.fetchActor })(PersonPage);
