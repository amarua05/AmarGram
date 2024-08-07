import { useGetCurrentUser, useLikePost, useSavePost, useUnsavePost } from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { Link } from 'react-router-dom'

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({post, userId}: PostStatsProps) => {
    const likesList = post?.likes.map((user: Models.Document) => user.$id);
    const commentsList = post?.comment.map((user:Models.Document) => user.$id);

    const [comments] = useState<string[]>(commentsList);
    const [likes, setLikes] = useState<string[]>(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const {mutate: likePost} = useLikePost();
    const {mutate: savePost, isPending: isSavingPost} = useSavePost();
    const {mutate: unsavePost, isPending: isUnsavingPost} = useUnsavePost();
    
    const {data: currentUser} = useGetCurrentUser();
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);

    useEffect(() => {
     setIsSaved(!!savedPostRecord);
    },[currentUser])
    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes]

        const hasLiked = newLikes.includes(userId)
        if(hasLiked){
            newLikes = newLikes.filter((id) => id !== userId)
        } else{
            newLikes.push(userId)
        }
        setLikes(newLikes)
        likePost({postId: post?.$id || '', likesArray: newLikes})
    }
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();


        if(savedPostRecord){
            setIsSaved(false)
            unsavePost(savedPostRecord.$id)
        } else{
            savePost({postId: post?.$id || '', userId})
            setIsSaved(true)
        }
    }
  return (
    <div className='flex justify-between items-center z-20'>
     <div className='flex gap-2 mr-5'>
        <img 
        src={`${checkIsLiked(likes,userId) ? 
             '/assets/icons/liked.svg': '/assets/icons/like.svg'}`}
        alt="like"
        width={20}
        height={20}
        onClick={handleLikePost}
        className='cursor-pointer' />
        <p className='small-medium lg:base-medium'>{likes.length}</p>
     </div>
     <div className='flex gap-2 mr-5'>
        <Link to={`/${post?.creator.username}/posts/${post?.$id}`}>
            <img src="/assets/icons/comment.svg" 
                alt="Comment"
                width={20}
                height={20}
                className='cursor-pointer' />
        </Link>
        <p className='small-medium lg:base-medium'>{comments.length}</p>
     </div>
     <div className='flex gap-2 mr-5'>{isSavingPost || isUnsavingPost ? <Loader /> :
        <img src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'} 
        alt="save"
        onClick={handleSavePost}
        className='cursor-pointer' />}
     </div>
    </div>
  )
}

export default PostStats;
