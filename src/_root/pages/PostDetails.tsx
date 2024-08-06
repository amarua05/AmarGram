import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useDeletePost, useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { timeAgo } from '@/lib/utils';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending} = useGetPostById(id || '');
  const { user } = useUserContext()
  const navigate = useNavigate()
  const { mutate: deletePost } = useDeletePost();
  
  const handleDeletePost = () => {
    deletePost({postId: id || '', imageId: post?.imageId || ''});;
    navigate(-1);
  };
  return (
    
    <div className='post_details-container'>
      {isPending ? <Loader /> : (
        <div className='post_details-card'>
           <img src={post?.imageURL} 
                alt="aaa"
                className='post_details-img' />
           <div className="post_details-info">
              <div className='flex-between w-full'>
                <Link className='flex items-center gap-3' 
                      to={`/profile/${post?.creator.username}`}>
                  <img
                    src={
                      post?.creator?.imageURL ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-12 lg:h-12 rounded-full"
                  />
                
                  <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                      <p className="subtle-semibold lg:small-regular ">
                        {timeAgo(post?.$createdAt || '')}
                      </p>
                      •
                      <p className="subtle-semibold lg:small-regular">
                        at {post?.location} 
                      </p>
                    </div>
                  </div>
                </Link>
                <div className='flex-center gap-4'>
                    <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && 'hidden'}`}>
                    <img src="/assets/icons/edit.svg" width={24} height={24} alt='edit' />
                    </Link>
                    <Button onClick={handleDeletePost}
                            className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`}>
                      <img src="/assets/icons/delete.svg" 
                           alt="delte button" 
                           height={24}
                           width={24}/>
                    </Button>
                </div>
            </div>
            <hr className='border w-full border-dark-4/80'/>
            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
              <p className="base-medium lg:body-bold text-light-1">
                      {post?.caption}
              </p>
              <ul className={`flex gap-1 mt-2 ${post?.tags == 0 && "hidden"}`}> 
            {post?.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
              #{tag}
            </li>
            ))}
          </ul>
            </div>
            <div className='w-full'>
              <PostStats post={post} userId={user.id} />
            </div>
        </div>

        </div>
      )}
    </div>
  )
}

export default PostDetails
