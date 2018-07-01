import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import MediaQuery from 'react-responsive';
import '../media/Media.less';

const Rating = () => (
  <div className="MediaHeader__info__rating">
    <h4>Rating</h4>
    <p className="ant-card-loading-block" style={{ width: '75%', height: 16 }} />
  </div>
);

const MediaLoading = props => (
  <div className="MediaItem">
    {/* Only show on larger screens */}
    <MediaQuery query="(min-width: 768px)">
      <div className="MediaItem__backdrop" style={{ background: '#000', opacity: 0.5 }} />
    </MediaQuery>
    <div className="MediaHeader">
      {/* Only show on larger screens */}
      <MediaQuery query="(min-width: 768px)">
        <div className="MediaHeader__poster">
          <p className="ant-card-loading-block" style={{ height: 300, width: 200, marginBottom: '1em' }} />
          {/* Don't show rating on new post page */}
          {!props.isNewPostPage && <Rating />}
        </div>
      </MediaQuery>
      <div className="MediaHeader__info" style={{ background: '#000', opacity: 0.8 }}>
        <div className="MediaHeader__info__title">
          <p className="ant-card-loading-block" style={{ height: 48 }} />
        </div>
        <Row gutter={32} type="flex">
          <Col xs={24} sm={24} lg={14}>
            <div className="MediaHeader__info__overview">
              <h4>Overview</h4>
              <p className="ant-card-loading-block" style={{ height: 16, margin: '10px 0' }} />
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
            </div>
            {!props.isNewPostPage &&
              /* Show rating if on mobile/tablet */
              <MediaQuery query="(max-width: 768px)">
                <Rating />
              </MediaQuery>
            }
          </Col>

          <Col xs={24} sm={24} lg={10}>
            <div className="MediaHeader__info__actors">
              <h4>Actors</h4>
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
            </div>
            <div className="MediaHeader__info__genres">
              <h4>Genres</h4>
              <p className="ant-card-loading-block" style={{ height: 16, marginBottom: 10 }} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
);

MediaLoading.propTypes = {
  isNewPostPage: PropTypes.bool.isRequired,
};

export default MediaLoading;
