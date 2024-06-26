import { useGetCurrentUser, useLikeSnippet } from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite';
import React, { useState } from 'react'

type snippetStatsProps = {
    snippet?: Models.Document;
    userId: string;
}

const SnippetStats = ({ snippet, userId }: snippetStatsProps) => {
    const snippetsList = snippet?.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(snippetsList);

    const { mutate: likeSnippet } = useLikeSnippet();

    const { data: currentUser } = useGetCurrentUser();

    const handleLikeSnippet = (event: React.MouseEvent) => {
        event.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId);

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes)
        likeSnippet({ snippetId: snippet?.$id || "", likesArray: newLikes})
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                    src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikeSnippet}
                    className={`cursor-pointer ${checkIsLiked(likes, userId) ? "" : "invert-cyan"}`}
                />
                <p className="small-medium lg:base-medium">
                    {likes.length}
                </p>
            </div>
        </div>
    )
}

export default SnippetStats