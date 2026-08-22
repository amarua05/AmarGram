import { useGetLikes, useLikePostNew, useUnlikePost, useGetSaves, useSavePost, useUnsavePost } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import Loader from './Loader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const { data: likesData } = useGetLikes(post?.$id || '');
  const { mutate: likePost } = useLikePostNew();
  const { mutate: unlikePost } = useUnlikePost();
  const { data: userSaves } = useGetSaves(userId);
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: unsavePost, isPending: isUnsavingPost } = useUnsavePost();

  const [isSaved, setIsSaved] = useState(false);

  const likes = likesData?.documents ?? [];
  const userLikeRecord = likes.find((like: Models.Document) => like.user?.$id === userId);
  const isLiked = !!userLikeRecord;

  const savedPostRecord = userSaves?.documents.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    if (!post?.$id) return;

    if (isLiked && userLikeRecord) {
      unlikePost({ likeRecordId: userLikeRecord.$id, postId: post.$id });
    } else {
      likePost({ postId: post.$id, userId });
    }
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    if (!post?.$id) return;

    if (savedPostRecord) {
      setIsSaved(false);
      unsavePost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div className='flex items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img
          src={isLiked ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className='cursor-pointer' />
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>
      <div className='flex gap-1 mr-5'>
        <Link to={`/${post?.creator?.username}/posts/${post?.$id}`}>
          <img src="/assets/icons/comment.svg"
            alt="Comment"
            width={20}
            height={20}
            className='cursor-pointer' />
        </Link>
        <p className='small-medium lg:base-medium'>{post?.comment?.length}</p>
      </div>
      <div className='flex gap-2 ml-auto'>{isSavingPost || isUnsavingPost ? <Loader /> :
        <img src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
          alt="save"
          onClick={handleSavePost}
          className='cursor-pointer' />}
      </div>
    </div>
  )
}

export default PostStats;