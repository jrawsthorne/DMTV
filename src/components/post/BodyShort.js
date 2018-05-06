/* taken from https://github.com/busyorg/busy/blob/e9ca97ec6888f6011b32e57d20944c4ff940bdf4/src/client/components/Story/BodyShort.js */
/* 03/05/2018 */
/* modified to output number of lines */
import React from 'react';
import PropTypes from 'prop-types';
import striptags from 'striptags';
import Remarkable from 'remarkable';
import Dotdotdot from 'react-dotdotdot';

const remarkable = new Remarkable({ html: true });

function decodeEntities(body) {
  return body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const BodyShort = (props) => {
  let body = striptags(remarkable.render(striptags(decodeEntities(props.body))));
  body = body.replace(/(?:https?|ftp):\/\/[\S]+/g, '');

  // If body consists of whitespace characters only skip it.
  if (!body.replace(/\s/g, '').length) {
    return null;
  }

  return (
    <div className={props.className}>
      <Dotdotdot clamp={props.length}>{body}</Dotdotdot>
    </div>
  );
};

BodyShort.propTypes = {
  className: PropTypes.string,
  body: PropTypes.string,
  length: PropTypes.number,
};

BodyShort.defaultProps = {
  className: '',
  body: '',
  length: 7,
};

export default BodyShort;
