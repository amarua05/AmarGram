import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || '');
  const {user} = useUserContext();
  const navigate = useNavigate()
  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
    if (post?.creator.$id === user.id) {
      return (
        <div className="flex flex-1">
          <div className="common-container">
            <div className="flex-start gap-3 justify-start w-full max-w-5xl">
              <img
                src="/assets/icons/edit.svg"
                width={36}
                height={36}
                alt="edit"
                className="invert-white"
              />
              <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
            </div>
      
            {isLoading ? <Loader /> : <PostForm action="Update" post={post} />}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center text-center justify-center w-full">
          <div>
          <h2>(401) Unauthorized Access</h2>
          <p>You do not have permission to edit this post.</p>
          </div>
          <br />
            <div className="flex justify-center items-center gap-6">
            <Button
              type="button"
              className="shad-button_dark_4"
              onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button
              type="button"
              className="shad-button_dark_4"
              onClick={() => navigate('/')}>
              Go home
            </Button>
            </div>
          </div>
          );
        }
    
  
};

export default EditPost;