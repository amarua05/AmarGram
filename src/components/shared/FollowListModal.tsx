import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetFollowers, useGetFollowing } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import FollowButton from "./FollowButton";

type FollowListModalProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "followers" | "following";
};

const FollowListModal = ({ userId, open, onOpenChange, defaultTab = "followers" }: FollowListModalProps) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(defaultTab);

  const { data: followers, isPending: isFollowersLoading } = useGetFollowers(userId);
  const { data: following, isPending: isFollowingLoading } = useGetFollowing(userId);

  const followerUsers = followers?.documents.map((doc: any) => doc.follower) ?? [];
  const followingUsers = following?.documents.map((doc: any) => doc.following) ?? [];

  const list = activeTab === "followers" ? followerUsers : followingUsers;
  const isLoading = activeTab === "followers" ? isFollowersLoading : isFollowingLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-2 border-dark-4 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-light-1">
            <div className="flex gap-6 border-b border-dark-4 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("followers")}
                className={`base-medium ${activeTab === "followers" ? "text-light-1 border-b-2 border-primary-500" : "text-light-3"}`}
              >
                Followers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("following")}
                className={`base-medium ${activeTab === "following" ? "text-light-1 border-b-2 border-primary-500" : "text-light-3"}`}
              >
                Following
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto flex flex-col gap-1">
          {isLoading ? (
            <div className="flex-center py-8">
              <Loader />
            </div>
          ) : list.length === 0 ? (
            <p className="text-light-3 text-center py-8">
              {activeTab === "followers" ? "No followers yet." : "Not following anyone yet."}
            </p>
          ) : (
            list.map((u: any) => (
              <div className="flex items-center justify-between w-full p-4">

              <Link
                key={u.$id}
                to={`/profile/${u.username}`}
                onClick={() => onOpenChange(false)}
                className=""
              >
                {/* Left: avatar + name/username */}
                <div className="flex items-center gap-3">
                  <img
                    src={u.imageURL || "/assets/icons/profile-placeholder.svg"}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="body-bold text-light-1">{u.name}</p>
                    <p className="small-regular text-light-3">@{u.username}</p>
                  </div>
                </div>
                </Link>
                {/* Right: follow button */}
                <div className="shrink-0" onClick={(e) => e.preventDefault()}>
                  <FollowButton targetUserId={u.$id} />
                </div>
              
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowListModal;