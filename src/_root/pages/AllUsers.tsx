import UserSearchResults from "@/components/shared/UserSearchResults";
import GridUserList from "./GridUserList";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutations";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";

const AllUsers = () => {
  const {data: users} = useGetUsers();

  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 300);
  const {data: searchedUsers, isFetching: isSearchFetching} = useSearchUsers(debouncedValue);

  if(!users){
    return(
      <div className="w-full flex-center h-full">
        <Loader  />
      </div>
    )
  }
  const shouldShowSearchResults = searchValue !== ''
  const shouldShowPosts = !shouldShowSearchResults && users.pages.every((item) => item.documents.length === 0)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Users
        </h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg"
               width={24}
               height={24}
               alt="Search" />
          <Input type='text'
                 placeholder='Search'
                 className='explore-search'
                 value={searchValue}
                 onChange={(e) => setSearchValue(e.target.value)} />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Active Users</h3>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <UserSearchResults 
                        searchedUsers={searchedUsers}  
                        isSearchFetching = {isSearchFetching}/>
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center">End of users.</p>
        ) : users.pages.map((item, index) => (
          <GridUserList key={`page-${index}`} users={item.documents}/>
        ))}
      </div>
    </div>
  )
}

export default AllUsers
