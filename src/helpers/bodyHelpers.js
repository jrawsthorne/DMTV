import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import sanitizeConfig from '../vendor/SanitizeConfig';

export const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: true,
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’',
});

export function getHtml(body) {
  let parsedBody = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  parsedBody = parsedBody.replace(/^\s+</gm, '<');

  // const htmlReadyOptions = { mutate: true, resolveIframe: true };
  parsedBody = remarkable.render(parsedBody);
  // parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  parsedBody = sanitizeHtml(parsedBody, sanitizeConfig({}));

  /* eslint-disable-next-line react/no-danger */
  return <div dangerouslySetInnerHTML={{ __html: parsedBody }} />;
}

const Body = props => <div>{getHtml(props.body, props.jsonMetadata)}</div>;

Body.propTypes = {
  body: PropTypes.string,
  jsonMetadata: PropTypes.string,
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  rewriteLinks: false,
};

export default Body;
