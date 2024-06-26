import { useQuery, useMutation, useQueryClient, useInfiniteQuery, QueryClient, } from "@tanstack/react-query";
import { checkCurrentAccount, createPost, createUserAccount, signInAccount, signOutAccount, getRecentPosts, likePost, savePost, deleteSavedPost, getCurrentUser, getPostById, updatePost, deletePost, searchPosts, getUsers, getUserById, updateUser, addFriend, getUserPosts, createComment, getPostComments, likeComment, getFilterPosts, getAllPosts, incrementPostViews, createSnippet, createNote, getPostSnippets, getNotes, likeSnippet } from "../appwrite/api";
import { INewComment, INewNote, INewPost, INewSnippet, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { 
            email: string, 
            password: string, 
        }) => signInAccount(user)
    })
}

export const useCheckCurrentAccount = () => {
    return useMutation({
        mutationFn: checkCurrentAccount
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            })
        }
    })
}

export const useCreateSnippet = () => {
    const queryClient = useQueryClient();

    
    return useMutation({
        mutationFn: (snippet: INewSnippet) => createSnippet(snippet),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_SNIPPETS]
            })
        }
    })
  
    // return useMutation({
    //     mutationFn: async (snippet: INewSnippet) => {
    //       console.log("Mutation function is called with snippet:", snippet);
    //       const result = await createSnippet(snippet);
    //       console.log("Snippet created:", result);
    //       return result;
    //     },
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({
    //         queryKey: [QUERY_KEYS.GET_RECENT_SNIPPETS],
    //       });
    //     },
    //     onError: (error) => {
    //       console.error("Error creating snippet:", error);
    //     }
    //   });
  };

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: INewComment) => createComment(comment),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_COMMENTS]
            })
        }
    })
}

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (note: INewNote) => createNote(note),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_NOTES]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })  
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray}: { postId: string; likesArray: string[]}) => likePost(postId, likesArray),
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
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_FILTER_POSTS]
            })
        }
    })
}

export const useLikeSnippet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ snippetId, likesArray }: { snippetId: string; likesArray: string[]}) => likeSnippet(snippetId, likesArray)
    })
}

export const useLikeComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, likesArray }: { commentId: string; likesArray: string[]}) => likeComment(commentId, likesArray)
    })
}

export const useFriendUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, friendsArray}: {userId: string; friendsArray: string[]}) => addFriend(userId, friendsArray),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            })
        },
        onError: (error) => {
            console.error("Failed to update friends:", error);
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId}: { postId: string; userId: string}) => savePost(postId, userId),
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

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
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

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useGetUserPosts = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
      queryFn: () => getUserPosts(userId),
      enabled: !!userId,
    });
};

export const useGetPostSnippets = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_SNIPPETS],
        queryFn: () => getPostSnippets(postId),
        enabled: !! postId
    })
}

export const useGetPostComments = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_COMMENTS],
        queryFn: () => getPostComments(postId),
        enabled: !! postId
    })
}

export const useGetSnippetNotes = (snippetId?: string) => {
    console.log(snippetId)
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_NOTES, snippetId],
        queryFn: () => getNotes(snippetId),
        enabled: !! snippetId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, imageId }: {postId?: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_FILTER_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.SEARCH_POSTS]
            });
        }
    })
}

export const useAddView = () => {
    return useMutation({
        mutationFn: ({ postId }: {postId: string}) => incrementPostViews(postId)
    })
}

export const useGetPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
        queryFn: getAllPosts,
    })
}

export const useSearchPosts = (searchTerm: string, currentPage: number, pageSize: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm, currentPage],
        queryFn: () => searchPosts(searchTerm, currentPage, pageSize),
        enabled: !!searchTerm
    })
}

export const useGetFilterPosts = (selectedFilter: string, currentPage: number, pageSize: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_FILTER_POSTS, selectedFilter, currentPage],
        queryFn: () => getFilterPosts(selectedFilter, currentPage, pageSize),
        enabled: !!selectedFilter
    })
}

export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit),
    })
}

export const userGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
        }
    })
}