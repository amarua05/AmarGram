import { ID, Query } from "appwrite";
import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { INewComment, INewPost, INewUser, IUpdatePost } from "@/types";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageURL: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageURL: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== VERIFY EMAIL
export async function sendVerificationEmail(redirectUrl: string) {
  try {
    const verification = await account.createVerification(redirectUrl);

    return verification;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function verifyUserEmail(userId: string, secret: string) {
  try {
    const verification = await account.updateVerification(userId, secret);

    return verification;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== GET ACCOUNT
export function getAccount() {
  try {
    const currentAccount = account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    if (!post.file || post.file.length === 0) {
      throw new Error("Missing required parameter: file");
    }

    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFileView(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageURL: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL

export function getFileView(fileId: string) {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ...existing code...

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;

  return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const saved = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    return saved;
  } catch (error) {
    console.log(error);
  }
}

export async function getSaves(userId: string) {
  try {
    const saves = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", userId)]
    );

    return saves;
  } catch (error) {
    console.log(error);
    return { documents: [] };
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function unsavePost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function unsaveAllPostSaves(postId: string) {
  try {
    // Fetch all saves related to the post
    const saves = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("post", postId)] // Adjust filter if needed
    );

    if (saves?.documents) {
      for (const save of saves.documents) {
        await unsavePost(save.$id);
      }
    }

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageURL: post.imageURL,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      const fileUrl = getFileView(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageURL: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        location: post.location,
        imageURL: image.imageURL,
        imageId: image.imageId,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    console.log("Post deleted successfully");
  } catch (error) {
    console.log(error);
  }
}

//  Comments
export async function createComment(comment: INewComment) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        comment: comment.comment,
        user: comment.user,
        post: comment.post,
        username: comment.username,
      }
    );
    if (!newComment) {
      throw Error;
    }
    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function getComments() {
  try {
    const comments = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(30)]
    );
    return comments;
  } catch (error) {
    console.log(error);
  }
}
export async function getCommentById(commentId: string) {
  try {
    const comment = databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );
    return comment;
  } catch (error) {
    console.log(error);
  }
}

//INFINITE POSTS
export async function searchPosts({ searchTerm }: { searchTerm: string }) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteComment(commentId: string) {
  if (!commentId) throw Error;
  
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAllPostComments(postId: string) {
  try {
    // Fetch comments related to the specific post
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal("post", postId)] // Filter comments by postId
    );
    
    if (comments?.documents) {
      for (const comment of comments.documents) {
        await deleteComment(comment.$id); // Delete each comment by ID
      }
    }
  } catch (error) {
    console.log(error);
    throw error; // Handle errors appropriately
  }
}

export async function searchUsers({ searchTerm }: { searchTerm: string }) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("username", searchTerm)]
    );
    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers() {
  const users = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!users) throw Error;

  return users;
}

export async function getUserByUsername(username: string) {
  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("username", username), Query.limit(1)]
    );

    if (!user) throw Error;

    return user.documents[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator.$id", userId), Query.orderDesc("$createdAt")]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// FOLLOWS
// ============================================================

// ============================== FOLLOW USER
export async function followUser(followerId: string, followingId: string) {
  try {
    const follow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
        follower: followerId,
        following: followingId,
      }
    );

    return follow;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UNFOLLOW USER
export async function unfollowUser(followRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      followRecordId
    );
    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== CHECK IF FOLLOWING (returns the follow doc or null)
export async function getFollowStatus(followerId: string, followingId: string) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", followerId),
        Query.equal("following", followingId),
      ]
    );

    return result.documents[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== GET FOLLOWERS (who follows this user)
export async function getFollowers(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("following", userId)]
    );

    return followers;
  } catch (error) {
    console.log(error);
    return { documents: [] };
  }
}

// ============================== GET FOLLOWING (who this user follows)
export async function getFollowing(userId: string) {
  try {
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("follower", userId)]
    );

    return following;
  } catch (error) {
    console.log(error);
    return { documents: [] };
  }
} 