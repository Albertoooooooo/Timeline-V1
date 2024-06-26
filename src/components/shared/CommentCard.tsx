import { useUserContext } from '@/context/AuthContext';
import { useGetPostById, userGetUserById } from '@/lib/react-query/queriesAndMutations';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite'
import React from 'react'
import { Link, useParams } from 'react-router-dom';
import CommentStats from './CommentStats';

type CommentCardProps = {
    comments: Models.Document;
}

const CommentCard = ({comments}: CommentCardProps) => {
    const { user } = useUserContext();
    // const { id } = useParams();
    // console.log("comment card id:", id)
    // const { data: post, isPending } = useGetPostById(id || "");
    // console.log("comment card:", post)
  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${comments?.creator.$id}`}>
                        <img
                        src={comments?.creator?.imageUrl || "'/assets/icons/profile-placeholder.svg"}
                        alt="creator"
                        className="rounded-full w-12 lg:h-12"
                        />
                </Link>

                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {comments.creator.name}
                    </p>
                    <div>
                        <p className="flex-center gap-2 text-light-3">
                            {multiFormatDateString(comments.$createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <Link to={`/update-comment/${comments.creator.$id}`}>
                <img
                src="/assets/icons/edit.svg"
                alt="edit"
                className={`invert-cyan ${user.id !== comments.creator.$id && "hidden" }`}
                width={20}
                height={20}
                />
            </Link>
        </div>

        <div className="small-medium lg:base-medium py-5">
            <p>
                {comments.caption}
            </p>
        </div>

        <CommentStats comment={comments} userId={user.id}/>
    </div>
  )
}

export default CommentCard