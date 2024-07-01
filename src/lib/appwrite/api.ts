import { INewComment, INewNote, INewPost, INewSnippet, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, avatars, databases, appwriteConfig, storage } from "./config";
import { M } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { ImageGravity } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const avatarUrl = avatars.getInitials(user.name);
        console.log(avatarUrl)

        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );

        if(!newAccount) throw Error;

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,

        })
        
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string,
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

export async function signInAccount(user: { email: string; password: string }) {
    try {
        console.log("sign in account function active")

        const session = await account.createEmailPasswordSession(user.email, user.password);
        console.log("api session:", session);

        return session;
    } catch (error) {
      console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

export async function checkCurrentAccount() {
    try {
        
        const session = await account.getSession("current");

        if (!session) {
            return null
        } else {
            return session
        }
    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount() {
    try {

        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
      console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) throw Error;

        // Get file Url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)

            throw Error;
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g,"").split(",") || [];

        const likesCount = 0

        const postViews = 0

        // Saves post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
                likesCount: likesCount,
                postViews: postViews,
            }
        )

        if(!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function createSnippet(snippet: INewSnippet) {
    console.log("before the try: ", snippet.postId)
    try {
        
        console.log("snippet query reaching api")
        const uploadedFile = await uploadFile(snippet.file[0]);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)

            throw Error
        }

        const likesCount = 0;

        const snippetViews = 0;

        const newSnippet = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.snippetCollectionId,
            ID.unique(),
            {
                creator: snippet.userId,
                post: snippet.postId,
                caption: snippet.caption,
                imageId: uploadedFile.$id,
                location: snippet.location,
                imageUrl: fileUrl,
                likesCount: likesCount,
                snippetViews: snippetViews,
            }
        )

        if (!newSnippet) {
            await deleteFile(uploadedFile.$id)

            throw Error
        }

        console.log(newSnippet)

        return newSnippet;
    } catch (error) {
        console.log(error);
    }
}

export async function createComment(comment: INewComment) {
    console.log("postId in comments: ", comment.postId)
    try {
        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            ID.unique(),
            {
                creator: comment.userId,
                post: comment.postId,
                caption: comment.caption,
            }
        )
    
        if (!newComment) throw Error;
    
        return newComment;
    } catch (error) {
        console.log(error)
    }
}

export async function createNote(note: INewNote) {
    try {
        const newNote = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notesCollectionId,
            ID.unique(),
            {
                creator: note.userId,
                snippet: note.snippetId,
                caption: note.caption,
            }
        )

        if (!newNote) throw Error;

        return newNote;
    } catch (error) {

    }
}

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

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
        );
        

        if(!fileUrl) throw Error;

        return fileUrl;

    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try{
        await storage.deleteFile(appwriteConfig.storageId, fileId)

        return { status: "ok" }
    } catch (error) {
        console.log(error);
    }
}

export async function getUserPosts(userId?: string) {
    if (!userId) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("postViews")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
}

export async function getPostSnippets(postId?: string) {
    if (!postId) return;

    try {
        const snippet = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.snippetCollectionId,
            [Query.equal("post", postId), Query.orderDesc("$createdAt")]
        );

        if (!snippet) throw Error;
        
        return snippet;
    } catch (error) {
        console.log(error);
    }
}

export async function getPostComments(postId?: string) {
    if (!postId) return;

    try {
        const comment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            [Query.equal("post", postId), Query.orderAsc("$createdAt")]
        );

        if (!comment) throw Error;

        return comment;
    } catch (error) {
        console.log(error);
    }
}

export async function getNotes(snippetId?: string) {
    console.log(snippetId)
    if (!snippetId) return;

    try{
        const note = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.notesCollectionId,
            [Query.equal("snippet", snippetId), Query.orderAsc("$createdAt")]
        )

        if (!note) throw Error;

        return note;
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

    if(!posts) throw Error;

    return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
    try{

        const updatedLikesCount = likesArray.length;

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray,
                likesCount: updatedLikesCount,
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function incrementPostViews(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        const updatedViewsCount = (post.postViews || 0) + 1

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                postViews: updatedViewsCount
            },
        )

        if (!updatedPost) throw Error

        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function likeSnippet(snippetId: string, likesArray: string[]) {
    try {
        const updatedSnippet = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.snippetCollectionId,
            snippetId,
            {
                likes: likesArray
            }
        )

        if (!updatedSnippet) throw Error;

        return updatedSnippet
    } catch (error) {
        console.log(error);
    }
}

export async function likeComment(commentId: string, likesArray: string[]) {
    try {
        const updatedComment = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentCollectionId,
            commentId,
            {
                likes: likesArray
            }
        )

        if(!updatedComment) throw Error;

        return updatedComment;
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try{
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionID,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try{
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionID,
            savedRecordId,
        )

        if(!statusCode) throw Error;

        return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return post
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        }

        if(hasFileToUpdate) {
            // Upload image to storage
            const uploadedFile = await uploadFile(post.file[0]);

            if(!uploadedFile) throw Error;

            // Get file Url
            const fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                await deleteFile(uploadedFile.$id)

                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }

        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g,"").split(",") || [];

        // Saves post to database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        )

        if(!updatedPost) {
            await deleteFile(post.imageId)
            throw Error;
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId?: string, imageId?: string) {
    if (!postId || !imageId) return;

    try {
        const currentPost = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        if (currentPost.save.length > 0 || currentPost.comments.length > 0) {
            const findSavedPosts = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.savesCollectionID,
                [Query.equal("post", postId)]
            )

            const findPostComments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.commentCollectionId,
                [Query.equal("post", postId)]
            )

            if (findSavedPosts.documents.length !== 0) {
                for (const document of findSavedPosts.documents) {
                    await databases.deleteDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.savesCollectionID,
                        document.$id
                    )
                }
            }

            if (findPostComments.documents.length !== 0) {
                for (const document of findPostComments.documents) {
                    await databases.deleteDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.commentCollectionId,
                        document.$id
                    )
                }
            }
        }
        
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        if (!statusCode) throw Error;

        await deleteFile(imageId);

        return { status: "Ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getAllPosts() {
    const queries: any[] = [Query.orderDesc(`$updatedAt`), Query.limit(20)]
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function searchPosts(searchTerm: string, currentPage: number, pageSize: number) {
    const offset = (currentPage - 1) * pageSize;
    const queries: any[] = [
        Query.limit(pageSize),
        Query.offset(offset),
        Query.search("caption", searchTerm),
    ];

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getFilterPosts(selectedFilter: string, currentPage: number, pageSize: number) {
    const offset = (currentPage - 1) * pageSize;
    const queries: any[] = [
        Query.limit(pageSize),
        Query.offset(offset)
    ];

    switch (selectedFilter) {
        case "latest":
            queries.push(Query.orderDesc('$createdAt'));
            break;
        case "oldest":
            queries.push(Query.orderAsc('$createdAt'));
            break;
        case "most-liked":
            queries.push(Query.orderDesc('likesCount')); // Assuming 'views' is a field in your collection
            break;
        case "most-viewed":
            queries.push(Query.orderDesc('postViews')); // Assuming 'views' is a field in your collection
            break;     
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit));   
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        if (!user) throw Error;

        return user;
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        };
        
        if (hasFileToUpdate) {
            // Upload new file to storage
            const uploadedFile = await uploadFile(user.file[0])

            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        // Update user
        const UpdatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                username: user.username,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        );

        // Failed update
        if (!UpdatedUser) {

            // Deletes new file that has been created
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }

            // Throws error if no new file uploaded
            throw Error;
        }

        // Deletes old file after update
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updateUser;

    } catch (error) {
        console.log(error);
    }
}

export async function addFriend(userId: string, friendsArray: string[]) {
    try {

        const updateUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {friends: friendsArray}
        )

        if (!updateUser) throw Error;

        return updateUser;

    } catch  (error) {
        console.log(error);
    }
}