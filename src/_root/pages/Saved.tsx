import { useEffect, useState } from "react";

import { useUserContext } from "../../context/AuthContext";
import { getSaves } from "../../lib/appwrite/api";
import Loader from "../../components/shared/Loader";
import GridPostList from "./GridPostList";

const Saved = () => {
  const { user } = useUserContext();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSavedPosts = async () => {
      
      if (!user) {
        setSavedPosts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const saves = await getSaves(user.id);
        const saveDocs = saves?.documents ?? [];
        const posts = saveDocs.map((save: any) => save.post).filter(Boolean);

setSavedPosts(posts);

        setSavedPosts(posts.filter(Boolean));
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setSavedPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="saved-container flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <img src="/assets/icons/save.svg" alt="saved" className="w-6 h-6" />
        <h2 className="h3-bold md:h2-bold">Saved Posts</h2>
      </div>

      {!savedPosts.length ? (
        <p className="text-light-3">No saved posts yet.</p>
      ) : (
        <GridPostList posts={savedPosts} />
      )}
    </div>
  );
};

export default Saved;