import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite";
import { useParams } from "react-router-dom";

type CommentProps = {
    comment: Models.Document;
}

const CommentForm = ({ comment}: CommentProps) => {
  const { id } = useParams();
  useGetPostById(id || '');
    return(
        <div >
            <p className="base-medium lg:body-bold text-light-1 border-orange-100">
                      {comment?.username}
                      {comment?.comment}
            </p>
        </div>
    )
}

export default CommentForm
