import GridUserList from '@/_root/pages/GridUserList';
import Loader from './Loader'

type SearchedResultProps = {
  isSearchFetching: boolean;
  searchedUsers: any;
}
const UserSearchResults = ({ isSearchFetching, searchedUsers }: SearchedResultProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedUsers && searchedUsers.documents.length > 0)
    return <GridUserList users={searchedUsers.documents} />;

  return (
    <div>
      <p className="text-light-4 mt-10 text-center w-full">
        Oops, no users found, please try looking up something else.
      </p>
    </div>
  );
};

export default UserSearchResults;
