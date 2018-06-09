import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Carousel } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import MediaQuery from 'react-responsive';
import * as actions from '../../actions/mediaActions';
import { SimilarItem } from '../media/Similar';
import BodyShort from '../post/BodyShort';
import { getPerson, getPersonState } from '../../reducers';
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
          {<BodyShort className="PersonPage__info__biography" length={400} body={actor.biography} />}
        </div>
        <h2>Known For</h2>
        <MediaQuery minWidth={1050}>
          {(matches) => {
          let num = 1;
          let centerPadding = '40px';
          let infinite = true;
          /* if above 1050px */
          if (matches) {
            num = 2;
            centerPadding = '100px';
          }
          if (actor.known_for.length === 1) {
            infinite = false;
            centerPadding = '0px';
          }
          return (
            <Carousel
              autoplay
              autoplaySpeed={5000}
              slidesToShow={num}
              pauseOnHover
              draggable
              swipeToSlide
              swipe
              centerPadding={centerPadding}
              centerMode
              lazyLoad
              infinite={infinite}
            >
              {/* for each item add it to the carousel */}
              {actor.known_for.map(item => <SimilarItem key={item.id} type={`${item.media_type === 'movie' ? 'movie' : 'show'}`} item={item} url={`/${item.media_type === 'movie' ? 'movie' : 'show'}/${item.id}`} />)}
            </Carousel>
          );
        }}
        </MediaQuery>
        <h2>More</h2>
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
  actor: getPerson(state, ownProps.match.params.id),
  ...getPersonState(state, ownProps.match.params.id),
});

export default connect(mapStateToProps, { fetchActor: actions.fetchActor })(PersonPage);
