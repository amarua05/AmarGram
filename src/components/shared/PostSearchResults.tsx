import Loader from './Loader'
import GridPostList from '@/_root/pages/GridPostList'

type SearchedResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
}
const PostSearchResults = ({ isSearchFetching, searchedPosts }: SearchedResultProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0)
    return <GridPostList posts={searchedPosts.documents} />;

  return (
    <div>
      <p className="text-light-4 mt-10 text-center w-full">
        Oops, no results found, please try looking up something else.
      </p>
    </div>
  );
};

export default PostSearchResults;
