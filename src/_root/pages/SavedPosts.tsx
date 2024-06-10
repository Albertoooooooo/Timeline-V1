import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import React from 'react'

const SavedPosts = () => {
    const { data: currentUser } = useGetCurrentUser();

    const savedPosts = currentUser?.save.map(
    (savePost: Models.Document) => ({
        ...savePost.post,
        creator: {
        imageUrl: currentUser.imageUrl
        },
    })
    ).reverse();

    if (!currentUser) {
      return (
        <div className="flex-center w-full h-full">
          <Loader />
        </div>
      )
    }

    console.log(currentUser.save)
  
    return (
      <>
        {savedPosts.length === 0 ? (
        <p className="text-light-4">No Saved Posts</p>
        ) : (
        <GridPostList posts={savedPosts} showUser={false} showStats={false}/>
        )}
      </>
    )
}

export default SavedPosts