import Loader from "@/components/shared/Loader";
import { useGetUserByUsername, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";
import GridPostList from "./GridPostList";
import { useGetFollowers, useGetFollowing } from "@/lib/react-query/queriesAndMutations";
import FollowListModal from "@/components/shared/FollowListModal";
import { useState } from "react";
import FollowButton from "@/components/shared/FollowButton";
import EditButton from "@/components/shared/EditButton";



const Profile = () => {
  const { username } = useParams();
  const { data: profileUser, isPending: isUserLoading } = useGetUserByUsername(username || "");
  const { data: userPosts, isPending: isPostsLoading } = useGetUserPosts(profileUser?.$id || "");
  const { data: followers } = useGetFollowers(profileUser?.$id || "");
  const { data: following } = useGetFollowing(profileUser?.$id || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"followers" | "following">("followers");

  const openFollowModal = (tab: "followers" | "following") => {
  setModalTab(tab);
  setModalOpen(true);
};
  const followerCount = followers?.documents.length ?? 0;
  const followingCount = following?.documents.length ?? 0;
  if (isUserLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-[30px] border border-dark-4 bg-dark-2 p-8 text-center shadow-lg md:p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-dark-4 text-3xl font-bold text-light-1">
            !
          </div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-light-3">
            User not found
          </p>
          <h1 className="h2-bold md:h1-bold text-light-1">This profile doesn’t exist</h1>
          <p className="mt-4 max-w-md text-base text-light-3">
            The username you visited is not in the app yet.
          </p>
          <div className="mt-8">
            <Link to="/all-users" className="shad-button_primary inline-flex items-center justify-center rounded-md px-4 py-2">
              Browse users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left xl:flex-row xl:items-center">
          <img
            src={profileUser.imageURL || "/assets/icons/profile-placeholder.svg"}
            alt={profileUser.name}
            className="h-28 w-28 rounded-full border border-dark-4 object-cover"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="h3-bold md:h2-bold">{profileUser.name}</h2>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => openFollowModal("followers")} className="flex flex-col items-center">
                <p className="body-bold">{followerCount}</p>
                <p className="small-regular text-light-3">Followers</p>
              </button>
              <button type="button" onClick={() => openFollowModal("following")} className="flex flex-col items-center">
                <p className="body-bold">{followingCount}</p>
                <p className="small-regular text-light-3">Following</p>
              </button>
            </div>

            <FollowListModal
              userId={profileUser.$id}
              open={modalOpen}
              onOpenChange={setModalOpen}
              defaultTab={modalTab}
            />
            <p className="text-light-3">@{profileUser.username}</p>
            {profileUser.bio && <p className="max-w-xl text-light-2">{profileUser.bio}</p>}
            <FollowButton targetUserId={profileUser.$id} />
            <EditButton targetUserId={profileUser.$id} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {!isPostsLoading && userPosts?.documents.length === 0 ? (
          <div className="rounded-[24px] border border-dark-4 bg-dark-2 p-10 text-center text-light-3">
            No posts yet from @{profileUser.username}
          </div>
        ) : (
          <GridPostList posts={userPosts?.documents || []} showUser={false} />
        )}
      </div>
    </div>
  );
};

export default Profile;
