import { useUserContext } from "@/context/AuthContext";
import { useDeleteComment, useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite";
import { useParams } from "react-router-dom";

type CommentProps = {
    comment: Models.Document;
}

const CommentForm = ({ comment }: CommentProps) => {
  const { id } = useParams();
  const { mutate: deleteComment } = useDeleteComment();
  const { user } = useUserContext();
  const { data: post } = useGetPostById(id || '');
  console.log('aa comment form');
  console.log(comment.user.$id)
  if (!comment || !user || !post) {
    return null;
  }

  const isCreator = comment.user.$id === user.id || post.creator.$id === user.id;
  
  return (
    
    <div>
      <p className="base-medium lg:body-bold text-light-1 border-orange-100">
        {comment?.username}
        {comment?.comment}
      </p>
      {isCreator && (
        <button 
        className={`ghost_details-delete_btn`}
        onClick={() => deleteComment(comment?.comment.$id)}></button>
      )}
    </div>
  );
}

export default CommentForm;
