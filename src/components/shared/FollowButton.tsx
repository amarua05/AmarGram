import { Button } from "@/components/ui/button";
import { useGetFollowStatus, useFollowUser, useUnfollowUser } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";

type FollowButtonProps = {
  targetUserId: string;
  size?: "default" | "sm";
};

const FollowButton = ({ targetUserId, size = "default" }: FollowButtonProps) => {
  const { user } = useUserContext();
  const followerId = user.id;

  const { data: followDoc, isLoading: isCheckingStatus } = useGetFollowStatus(followerId, targetUserId);
  const { mutate: followUser, isPending: isFollowing } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();

  if (!followerId || followerId === targetUserId) return null;

  const isPending = isCheckingStatus || isFollowing || isUnfollowing;

  const handleClick = () => {
    if (followDoc) {
      unfollowUser({
        followRecordId: followDoc.$id,
        followerId,
        followingId: targetUserId,
      });
    } else {
      followUser({ followerId, followingId: targetUserId });
    }
  };

  const sizeClasses = size === "sm" ? "h-7 px-3 py-1 text-xs rounded-md" : "";

  const colorClasses = followDoc
    ? "bg-dark-4 text-light-1 hover:bg-dark-4"
    : "bg-primary-500 text-light-1 hover:bg-primary-500";

  return (
    <Button
      type="button"
      className={`${colorClasses} ${sizeClasses} shrink-0`}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader /> : followDoc ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;