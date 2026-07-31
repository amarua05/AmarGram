import { useParams } from "react-router-dom";
import { useGetUserByUsername, useGetFollowers } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

const Followers = () => {
  const { username } = useParams();
  const { data: profileUser, isPending: isUserLoading } = useGetUserByUsername(username || "");
  const { data: followers, isPending: isFollowersLoading } = useGetFollowers(profileUser?.$id || "");

  if (isUserLoading || isFollowersLoading) return <Loader />;

  if (!profileUser) {
    return <p className="text-light-3">User not found.</p>;
  }

  const followerUsers = followers?.documents.map((doc: any) => doc.follower) ?? [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="h3-bold md:h2-bold">Followers</h2>
      {followerUsers.length === 0 ? (
        <p className="text-light-3">No followers yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {followerUsers.map((u: any) => (
            <li key={u.$id}>
              <Link to={`/profile/${u.username}`} className="flex items-center gap-3">
                <img
                  src={u.imageURL || "/assets/icons/profile-placeholder.svg"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="body-bold">{u.name}</p>
                  <p className="small-regular text-light-3">@{u.username}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Followers;