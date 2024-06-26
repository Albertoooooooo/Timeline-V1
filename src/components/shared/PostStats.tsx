import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesList = post?.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost, isPending: isLikingPost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

    const { data: currentUser } = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id)

    useEffect(() => {
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    const handleLikePost = (event: React.MouseEvent) => {
        event.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId)

        if(hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({ postId: post?.$id || "", likesArray: newLikes })
    }

    const handleSavePost = (event: React.MouseEvent) => {
        event.stopPropagation();


        if(savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id)
        } else {
            savePost({ postId: post?.$id || "", userId})
            setIsSaved(true);
        }
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img 
                    src="/assets/icons/eye.svg"
                    alt="views"
                    width={20}
                    height={20}
                    className="invert-cyan"
                />
                <p>{post?.postViews}</p>
                {isLikingPost ? (<Loader />) : (
                    <>
                        <img
                        src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                        alt="like"
                        width={20}
                        height={20}
                        onClick={handleLikePost}
                        className={`cursor-pointer ${checkIsLiked(likes, userId) ? "" : "invert-cyan" }`}
                        />
                        <p className="base-medium">{likes.length}</p>
                    </>
                )}
            </div>

            <div className="flex gap-2">
                {isSavingPost || isDeletingSaved ? <Loader /> : <img
                src={isSaved? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                alt="like"
                width={20}
                height={20}
                onClick={handleSavePost}
                className="cursor-pointer invert-cyan"
                />}
                <p className="small-medium lg:base-medium"></p>
            </div>
        </div>

    
  )
}

export default PostStats