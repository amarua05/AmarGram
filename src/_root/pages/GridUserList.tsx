import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import FollowButton from '@/components/shared/FollowButton';

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
      <div className='absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 w-full flex items-center justify-between gap-2'>
        <Link to={`/profile/${user.username}`}
              className='flex items-center justify-start gap-2 flex-1 min-w-0'>
          <p className='text-white line-clamp-1'>@{user.username}</p>
        </Link>
        <FollowButton targetUserId={user.$id} size="sm" />
      </div>
    </li>
  ))}
</ul>

  )
}

export default GridUserList