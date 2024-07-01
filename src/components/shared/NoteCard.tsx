import { useUserContext } from '@/context/AuthContext';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom';

type NoteCardProps = {
    notes: Models.Document;
}

const NoteCard = ({ notes }: NoteCardProps) => {
    const { user } = useUserContext();

    return (
        <div className="note-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${notes?.creator.$id}`}>
                        <img
                        src={notes?.creator?.imageUrl || "'/assets/icons/profile-placeholder.svg"}
                        alt="creator"
                        className="rounded-full w-12 lg:h-12"
                        />
                </Link>

                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {notes.creator.name}
                    </p>
                    <div>
                        <p className="flex-center gap-2 text-light-3">
                            {multiFormatDateString(notes.$createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <Link to={`/update-comment/${notes.creator.$id}`}>
                <img
                src="/assets/icons/edit.svg"
                alt="edit"
                className={`invert-cyan ${user.id !== notes.creator.$id && "hidden" }`}
                width={20}
                height={20}
                />
            </Link>
        </div>

        <div className="small-medium lg:base-medium py-5">
            <p>
                {notes.caption}
            </p>
        </div>
    </div>
    )
}

export default NoteCard