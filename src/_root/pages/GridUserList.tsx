import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';

type GridUserListProps= {
  users: Models.Document[],
}

const GridUserList = ({ users }: GridUserListProps) => {
  useUserContext();

  return (
    <ul className='grid-container'>
  {users.map((user) => (
    <li key={user.$id} className='relative min-w-[320px] h-[320px]'>
      <Link to={`/profile/${user.username}`} className='grid-post_link'>
        <img src={user.imageURL} alt="image" className='h-full w-full object-cover' />
      </Link>
      <div className='absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 w-full'>
        <Link to={`/profile/${user.username}`}
              className='flex items-center justify-start gap-2 flex-1'>
          <p className='text-white line-clamp-1'>@{user.username}</p>
        </Link>
      </div>
    </li>
  ))}
</ul>

  )
}

export default GridUserList
