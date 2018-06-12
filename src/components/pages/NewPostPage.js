/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Form, Input, AutoComplete, Select, Button, Spin, Icon } from 'antd';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import readingTime from 'reading-time';
import './NewPostPage.less';
import theMovieDBAPI from '../../apis/theMovieDBAPI';
import noImageFound from '../../images/no-image-found.jpg';
import MediaContainer from '../../containers/MediaContainer';
import { newPostInfo, createPost } from '../../actions/postActions';
import Body, { getHtml } from '../../helpers/bodyHelpers';
import { extractImageTags, extractLinks } from '../../helpers/parser';
import Loading from '../misc/Loading';
import Error401Page from './Error401Page';

const FormItem = Form.Item;

class NewPostPage extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    const value = _.get(data, 'search.value', '');
    /* if search value on load then search */
    if (value.length > 0) {
      this.handleSearch(value);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.data.tmdbid !== prevProps.data.tmdbid ||
      this.props.data.mediaType !== prevProps.data.mediaType) {
      /* remove error if tmdbid and mediaType */
      if (!_.isEmpty(this.props.data.tmdbid) && !_.isEmpty(this.props.data.mediaType)) {
        this.props.newPostInfo({
          search: {
            ...this.props.data.search,
            errors: null,
          },
        });
      } else if (_.isEmpty(this.props.data.search.errors)) {
        /* set errors if currently empty */
        this.props.newPostInfo({
          search: {
            ...this.props.data.search,
            errors: [
              { message: "Movie/show can't be empty" },
            ],
          },
        });
      }
    }
    /* hacky, set field value if set to change */
    if (_.get(this.props.data, 'change', false)) {
      this.props.form.setFieldsValue({ search: this.props.data.mediaTitle });
      this.props.newPostInfo({ change: false });
    }
  }

  getNewPostData = (form) => {
    const data = {
      body: form.body,
      title: form.title,
      lastUpdated: Date.now(),
    };

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    const {
      tmdbid, mediaType, seasonNum, episodeNum, mediaTitle,
    } = this.props.data;

    let tags = [`reviewapp-${mediaType}-reviews`];
    const { tags: formTags } = form;
    tags = _.uniq(tags.concat(formTags));
    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    let matches;

    const postBody = data.body;

    // eslint-disable-next-line
    while ((matches = userRegex.exec(postBody))) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    const parsedBody = getHtml(postBody, {}, 'text');

    const images = extractImageTags(parsedBody).map(tag =>
      tag.src.replace('https://steemitimages.com/0x0/', ''));
    const links = extractLinks(parsedBody);

    if (data.title && !this.permlink) {
      data.permlink = _.kebabCase(data.title);
    } else {
      data.permlink = this.permlink;
    }

    let type = mediaType;
    if (type === 'episode' || type === 'season') type = 'show';

    const metaData = {
      community: 'review',
      app: 'review/0.0.1',
      format: 'markdown',
      review: {
        tmdbid,
        mediaType,
        type,
        mediaTitle,
        seasonNum: seasonNum || undefined,
        episodeNum: episodeNum || undefined,
      },
      tags,
    };

    if (users.length) {
      metaData.users = users;
    }
    if (links.length) {
      metaData.links = links.slice(0, 10);
    }
    if (images.length) {
      metaData.image = images;
    }

    data.parentPermlink = tags.length ? tags[0] : 'general';
    data.jsonMetadata = metaData;

    return data;
  };

   /* validate fields on submit */
   handleSubmit = (e) => {
     e.preventDefault();

     this.props.form.validateFieldsAndScroll((err, values) => {
       if (!err) {
         const data = this.getNewPostData(values);
         this.props.createPost(data);
       }
     });
   }

  handleSearch = (q) => {
    this.props.newPostInfo({ searchFetching: true });
    if (q) {
      theMovieDBAPI.searchMulti({ query: q })
        .then(response => response.results)
        .then(data =>
        // filter out people
          data.filter(item => item.media_type !== 'person')
            .map(mediaItem => ({
              id: mediaItem.id,
              title: _.get(mediaItem, 'title') || _.get(mediaItem, 'name') || 'No title',
              /* set image to placeholder if not found */
              img: (mediaItem.poster_path && `https://image.tmdb.org/t/p/w45${mediaItem.poster_path}`) || noImageFound,
              year: (mediaItem.release_date && new Date(mediaItem.release_date).getFullYear()) ||
          (mediaItem.first_air_date && new Date(mediaItem.first_air_date).getFullYear()),
              url: `/${mediaItem.media_type === 'tv' ? 'show' : 'movie'}/${mediaItem.id}`,
              /* convert tmdbid types */
              mediaType: mediaItem.media_type === 'tv' ? 'show' : 'movie',
            })))
        /* update new post info with search state */
        .then(res => this.props.newPostInfo({
          searchResults: res,
          searchFetching: false,
        }));
    } else {
      /* clear search state if query empty */
      this.props.newPostInfo({
        searchResults: [],
        searchFetching: false,
      });
    }
  }

  /* wait 0.3s before searching */
  debouncedSearch = _.debounce(q => this.handleSearch(q), 300);

  /* search with trimmed value on change */
  handleAutoCompleteSearch = (value) => {
    this.debouncedSearch(value.trim());
  }

  /* change new post info on select */
  handleSelectOnAutoCompleteDropdown = (value, option) => {
    const { props: { mediatype, title }, key } = option;
    this.props.newPostInfo({
      tmdbid: key,
      mediaType: mediatype,
      mediaTitle: title,
      seasonNum: null,
      episodeNum: null,
      change: true, /* hacky, clear error on next render */
    });
  }

  /* return true if string length 0 */
  emptyInput = input =>
    _.get(this.props.data, `${input}.value`, '').length === 0

  /* search input valid if tmdbid and mediaType set */
  checkSearchInput = (rule, value, callback) => {
    const { data } = this.props;
    const tmdbid = _.get(data, 'tmdbid', '');
    const mediaType = _.get(data, 'mediaType', '');
    if (_.isEmpty(tmdbid) || _.isEmpty(mediaType)) {
      callback("Movie/show can't be empty");
    }
    callback();
  }

  /* tags valid if don't contain special characters */
  checkTags = (rule, value, callback) => {
    value
      .map(tag => ({ tag, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(tag) }))
      .filter(tag => !tag.valid)
      .map(tag =>
        callback(`Tag ${tag.tag} is invalid.`));
    callback();
  }
  render() {
    const {
      isAuthenticated,
      authLoaded,
      data: {
        mediaType,
        tmdbid,
        seasonNum,
        episodeNum,
        searchResults,
        searchFetching,
        body: bodyField,
        broadcasting,
      }, form: { getFieldDecorator, getFieldError },
    } = this.props;

    if (!authLoaded) return <Loading />;
    if (!isAuthenticated) return <Error401Page />;

    const body = _.get(bodyField, 'value', '');

    const { words, minutes } = readingTime(body);

    const dropdownOptions = _.map(searchResults, option => (
      <AutoComplete.Option key={`${option.id}`} mediatype={option.mediaType} title={option.title} url={option.url} className="search-autocomplete">
        <img alt="" width="45px" src={option.img} />
        {option.title} {option.year && `(${option.year})`}
      </AutoComplete.Option>
    ));

    const searchAutoComplete = (
      <AutoComplete
        dropdownClassName="NewPost-search-dropdown-container"
        dataSource={dropdownOptions}
        onSearch={this.handleAutoCompleteSearch}
        onSelect={this.handleSelectOnAutoCompleteDropdown}
        defaultActiveFirstOption={false}
        dropdownMatchSelectWidth={false}
        autoFocus
        optionLabelProp="title"
        autoCorrect="off"
        onPressEnter={e => e.preventDefault()}
      >
        <Input
          placeholder="Search for a show/film"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          autoCorrect="off"
          /* set input classname if empty and no error */
          className={classNames('NewPostPage__input', { NewPostPage__input__empty: this.emptyInput('search') && !getFieldError('search') })}
          id="mediaItem"
          /* search and fetching icon */
          suffix={searchFetching ? <Spin indicator={<Icon type="loading" style={{ fontSize: '16px', color: '#cccccc' }} spin />} /> : <Icon style={{ fontSize: '16px', color: '#cccccc' }} type="search" />}
        />
      </AutoComplete>);
    return (
      <React.Fragment>
        {/* show media container if mediaType and tmdbid */}
        {mediaType && tmdbid && <MediaContainer
          mediaType={mediaType}
          tmdbid={tmdbid}
          seasonNum={seasonNum && seasonNum.toString()}
          episodeNum={episodeNum && episodeNum.toString()}
        />}
        <Layout className="main-content NewPostPage">
          <h2>New post</h2>
          <Form hideRequiredMark onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('search', {
                initialValue: '',
                rules: [
                  { validator: this.checkSearchInput },
                ],
                validateTrigger: ['onChange', 'onSearch', 'onSelect'],
              })(searchAutoComplete)}
              <label
                htmlFor="search"
                /* set label value to error or label text */
                title={getFieldError('search') ? getFieldError('title') : 'Search for a show/film'}
                /* set label classname if empty and no error */
                className={classNames('NewPostPage__label', { NewPostPage__label__empty: this.emptyInput('search') && !getFieldError('search') })}
              >{getFieldError('search') ? getFieldError('search') : 'Search for a show/film'} {/* set label value to error or label text */}
              </label>
            </FormItem>
            <FormItem>
              {getFieldDecorator('title', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: 'Title can\'t be empty',
                  },
                  {
                    max: 255,
                    message: "Title can't be longer than 255 characters.",
                  },
                ],
              })(<Input
                name="title"
                /* set input classname if empty and no error */
                className={classNames('NewPostPage__input', { NewPostPage__input__empty: this.emptyInput('title') && !getFieldError('title') })}
                placeholder="Enter title"
                id="title"
              />)}
              <label
                htmlFor="title"
                /* set label value to error or label text */
                title={getFieldError('title') ? getFieldError('title')[0] : 'Enter Title'}
                /* set label classname if empty and no error */
                className={classNames('NewPostPage__label', { NewPostPage__label__empty: this.emptyInput('title') && !getFieldError('title') })}
              >{getFieldError('title') ? getFieldError('title')[0] : 'Enter Title'} {/* set label value to error or label text */}
              </label>
            </FormItem>
            <FormItem className="Tags" label="Tags">
              {getFieldDecorator('tags', {
                initialValue: [],
                rules: [
                  { validator: this.checkTags },
                ],
              })(<Select
                mode="tags"
                style={{ width: '100%' }}
                tokenSeparators={[',', ' ']}
                dropdownStyle={{ display: 'none' }}
                placeholder="Enter tags (separate with comma)"
                className="TagSelector"
                id="tags"
              />)}
            </FormItem>
            <FormItem label="Body" className="Body">
              {getFieldDecorator('body', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: 'Body can\'t be empty',
                  },
                ],
              })(<Input.TextArea rows={20} />)}
            </FormItem>
            {words !== 0 && <p>{words} word{words > 1 && 's'} / {Math.ceil(minutes)} minute{minutes > 1 && 's'} to read</p>}
            {!_.isEmpty(body) && <h2>Preview</h2>}
            {<Body body={body} returnType="Object" />}
            <Form.Item>
              <Button loading={broadcasting} htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Layout>
      </React.Fragment>
    );
  }
}

NewPostPage.propTypes = {
  newPostInfo: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  data: PropTypes.shape({
    search: PropTypes.shape(),
    title: PropTypes.shape(),
    tmdbid: PropTypes.string,
    mediaType: PropTypes.string,
    searchResults: PropTypes.arrayOf(PropTypes.shape()),
    searchFetching: PropTypes.bool,
    mediaTitle: PropTypes.string,
    body: PropTypes.shape(),
    seasonNum: PropTypes.string,
    episodeNum: PropTypes.string,
  }).isRequired,
  form: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  authLoaded: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  data: _.get(state, 'posts.newPost', {}),
  isAuthenticated: state.auth.isAuthenticated,
  authLoaded: state.auth.loaded,
  user: state.auth.user,
});

/* update store on field change */
const onFieldsChange = (props, fields) => {
  props.newPostInfo({ ...fields });
};

/* set fields based on redux store */
const mapPropsToFields = props => ({
  title: Form.createFormField({
    ...props.data.title,
    value: _.get(props.data, 'title.value', ''),
  }),
  search: Form.createFormField({
    ...props.data.search,
    value: _.get(props.data, 'search.value', ''),
  }),
  tags: Form.createFormField({
    ...props.data.tags,
    value: _.get(props.data, 'tags.value', []),
  }),
  body: Form.createFormField({
    ...props.data.body,
    value: _.get(props.data, 'body.value', ''),
  }),
});

export default
connect(mapStateToProps, { newPostInfo, createPost })(Form.create({
  onFieldsChange, mapPropsToFields,
})(NewPostPage));
