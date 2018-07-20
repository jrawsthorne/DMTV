import styled from 'styled-components';
import InfiniteScroll from '../../vendor/InfiniteScroll';

export const PostsLayout = styled(InfiniteScroll)`
  display: flex;
  flex-wrap: wrap;
`;

export const PostsContainer = styled.div`
  margin-left: -10px;
  margin-right: -10px;
`;
