import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createComment,
         createPost,
         createUserAccount,
         deleteComment,
         deletePost,
         getCommentById,
         getComments, 
         getCurrentUser, 
         getInfinitePosts, 
         getPostById, 
         getRecentPosts, 
         getSaves, 
         getUsers, 
         likePost, 
         savePost, 
         searchPosts, 
         searchUsers, 
         signInAccount, 
         signOutAccount, 
         unsavePost, 
         updatePost, 
         } from '../appwrite/api'
import { INewComment, INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation ({
        mutationFn: (user: INewUser) => createUserAccount(user)

    })
}

export const useSignInAccount = () => {
    return useMutation ({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user)

    })
}
export const useSignOutAccount = () => {
    return useMutation ({
        mutationFn: () => signOutAccount()

    })
}
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = ()=> {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, userId}: {postId: string; userId: string}) =>
        savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useUnsavePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (savedRecordId: string) => 
        unsavePost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })   
}

export const useGetSaves = () =>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVES],
        queryFn: getSaves,
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, likesArray}: {postId: string; likesArray: string[]}) =>
        likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
    

    
}

export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}
export const useUpdatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess:(data) => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
        })
    }
    })
}
export const useDeletePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess:() => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
    }
    })
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: INewComment) =>
        createComment(comment),
        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetComments = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS],
        queryFn: getComments,
    })
}
export const useGetCommentById = (commentId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENT_BY_ID, commentId],
        queryFn: () => getCommentById(commentId),
        enabled: !!commentId
    })
}


export const useGetPosts = () => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInfinitePosts as any, 
      getNextPageParam: (lastPage: any) => {
        if (lastPage && lastPage.documents.length === 0) {
          return null;
        }
  

        const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
        return lastId;
      },
      initialPageParam: undefined, 
    });
  };

export const useGetUsers = () => {
return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: getUsers, 
    getNextPageParam: (lastPage: any) => {
    if (lastPage && lastPage.documents.length === 0) {
        return null;
    }


    const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
    return lastId;
    },
    initialPageParam: undefined, 
});
};
  
  

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
      queryFn: () => searchPosts({searchTerm}),
      enabled: !!searchTerm,
    });
  };

export const useSearchUsers = (searchTerm: string) => {
return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
    queryFn: () => searchUsers({searchTerm}),
    enabled: !!searchTerm,
});
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({commentId}: {commentId: string}) => deleteComment(commentId),
        onSuccess:() => {
            queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
    }
    })
}