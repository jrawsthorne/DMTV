import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import sanitizeConfig from '../vendor/SanitizeConfig';
import htmlReady from '../vendor/steemitHtmlReady';

export const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false,
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’',
});

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object
export function getHtml(body, returnType = 'Object', options = {}) {
  let parsedBody = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');
  // causes issues parsedBody = parsedBody.replace(/^\s+</gm, '<');
  const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };
  parsedBody = remarkable.render(parsedBody);
  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  parsedBody = sanitizeHtml(parsedBody, sanitizeConfig({}));
  if (returnType === 'text') {
    return parsedBody;
  }

  if (options.rewriteLinks) {
    parsedBody = parsedBody.replace(
      /"https?:\/\/(?:www)?steemit.com\/([A-Za-z0-9@/\-.]*)"/g,
      (match, p1) => `"/${p1}"`,
    );
  }

  parsedBody = parsedBody.replace(
    /https:\/\/ipfs\.busy\.org\/ipfs\/(\w+)/g,
    (match, p1) => `https://gateway.ipfs.io/ipfs/${p1}`,
  );

  const sections = [];

  const splittedBody = parsedBody.split('~~~ embed:');
  for (let i = 0; i < splittedBody.length; i += 1) {
    let section = splittedBody[i];

    const match = section.match(/^([A-Za-z0-9_-]+) ([A-Za-z]+) (\S+) ~~~/);
    if (match && match.length >= 4) {
      const id = match[1];
      const type = match[2];
      const link = match[3];
      section = section.substring(`${id} ${type} ${link} ~~~`.length);
    }
    if (section !== '') {
      sections.push(section);
    }
  }
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: sections.join('') }} />;
}

const Body = props => <div>{getHtml(props.body, {}, 'Object')}</div>;

Body.propTypes = {
  body: PropTypes.string,
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  rewriteLinks: false,
};

export default Body;
