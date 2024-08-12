import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetComments,
  useGetPostById,
  useDeleteComment,
} from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import Comments from "./Comments";
import { Models } from "appwrite";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  deleteAllPostComments,
  deleteFile,
  unsaveAllPostSaves,
} from "@/lib/appwrite/api";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { isPending: isCommentLoading } = useGetComments();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: deleteComment } = useDeleteComment();

  const handleDeletePost = async () => {
    if (user.id === post?.creator.$id) {
      try {
        await unsaveAllPostSaves(id || "");

        // Delete all comments related to the post
        await deleteAllPostComments(id || "");

        await deleteFile(post.imageId || "");
        // 3. Delete the post
        await deletePost({ postId: id || "", imageId: post?.imageId || "" });
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Unauthorized: You are not the creator of this post");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment({ commentId });
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageURL}
            alt="picture"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                className="flex items-center gap-3"
                to={`/profile/${post?.creator.username}`}
              >
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
                      {timeAgo(post?.$createdAt || "")}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      at {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    width={24}
                    height={24}
                    alt="edit"
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete button"
                    height={24}
                    width={24}
                  />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p className="base-medium lg:body-bold text-light-1">
                {post?.caption}
              </p>
              <ul className={`flex gap-1 mt-2 ${post?.tags == 0 && "hidden"}`}>
                {post?.tags.map((tag: string, index: number) => (
                  <li
                    key={`${tag}-${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
              <Comments />
              {isCommentLoading ? (
                <Loader />
              ) : (
                <ul className="w-full max-w-2xl mx-auto py-8 space-y-6">
                  {post?.comment.map((comment: Models.Document) => (
                    <li key={comment.$id} className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border border-muted-foreground/20">
                          <AvatarImage
                            src={
                              comment.user.imageURL ||
                              "/assets/icons/profile-placeholder.svg"
                            }
                          />
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-md p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-medium">
                                {comment.user.username}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {timeAgo(comment.$createdAt || "")}
                              </div>
                              {(comment.user.$id === user.id ||
                                post?.creator.$id === user.id) && (
                                <Button
                                  onClick={() =>
                                    handleDeleteComment(comment.$id)
                                  }
                                  className={`ghost_details-delete_btn`}
                                >
                                  <img
                                    src="/assets/icons/delete.svg"
                                    alt="delete button"
                                    height={24}
                                    width={24}
                                  />
                                </Button>
                              )}
                            </div>
                            <p>{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
