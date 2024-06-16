import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import Button from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useFriendUser, useGetCurrentUser, userGetUserById } from '@/lib/react-query/queriesAndMutations';
import React, { useEffect, useState } from 'react'
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import LikedPosts from './LikedPosts';
import SavedPosts from './SavedPosts';
import { checkIsFriended } from '@/lib/utils';
import { Models } from 'appwrite';

interface UserStatsProps {
  value: string | number;
  label: string;
}

const UserStats = ({ value, label }: UserStatsProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
)

const Profile = () => {
  
  const { id } = useParams();
  console.log("Profile id: ",id)
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser, isPending } = userGetUserById(id || "");

  const [friends, setFriends] = useState<string[]>([]);

  const { mutate: friendUser } = useFriendUser();

  const { data: loggedInUser } = useGetCurrentUser();

  console.log("after useState:", friends)
  console.log("logged in user", loggedInUser)

  // useEffect(() => {
  //   console.log(loggedInUser)
  //   if (loggedInUser || loggedInUser !== undefined) {
  //     console.log("user friends:", loggedInUser.friends)
  //     console.log("friends", friends)
  //     setFriends(loggedInUser.friends.map((friend: Models.Document) => friend.$id))
  //     console.log("Logged in user:", loggedInUser)
  //   }
  //   else {
  //     console.log("did not fetch logged in user")
  //   }
  // }, [loggedInUser]);
  
  if (!currentUser || isPending || !loggedInUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
  );

  const handleAddFriend = (event: React.MouseEvent) => {
    console.log("Before propagation:", friends)
    event.stopPropagation();
  
    const friendId = currentUser.$id; // ID of the user to be friended
    const loggedInUserId = user.id; // ID of the logged-in user

    console.log("Current Friends Array:", friends);
  
    // Create a new friends array
    let newFriends = [...friends];
  
    // Check if the friendId is already in the friends array
    const hasFriended = newFriends.includes(friendId);
  
    if (hasFriended) {
      // Remove the friendId from the friends array
      newFriends = newFriends.filter((id) => id !== friendId);
      console.log("Removed friend:", friendId, "New Friends Array:", newFriends);
    } else {
      // Add the friendId to the friends array  
      newFriends.push(friendId); // Ensure a new array is created
      console.log("Added friend:", friendId, "New Friends Array:", newFriends);
    }
  
    // Update the friends state
    setFriends(newFriends);
  
    // Persist the updated friends array with the logged-in user's ID and the new friends array
    friendUser({ userId: loggedInUserId, friendsArray: newFriends });
  
    // Log the friend ID, the current user ID, and the updated friends array
    // console.log('Friend ID:', friendId);
    // console.log('Logged-in User ID:', loggedInUserId);
    // console.log('Updated Friends Array:', newFriends);
  };


  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">{currentUser.name}</h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <UserStats value={currentUser.posts.length} label="Posts"/>
              <UserStats value={currentUser.friends.length} label="Friended" />
              <UserStats value={20} label="Friended"/>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.$id && "hidden"}`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                  className="invert-cyan"
                />
                <p className="flex whitespace-nonwrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            
            <div className={`${user.id === currentUser.$id && "hidden"}`}>
              <Button 
              type="button"
              onClick={handleAddFriend}
              className="form-button_primary px-8"
              >
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-1-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
              className="invert-cyan"
            />
            Posts
          </Link>

          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"}`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
              className="invert-cyan"
            />
            Liked Posts
          </Link>

          <Link
            to={`/profile/${id}/saved-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/saved-posts` && "!bg-dark-3"}`}
          >
            <img
              src={"/assets/icons/save.svg"}
              alt="like"
              width={20}  
              height={20}
              className="invert-cyan"
            />
            Saved Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />} />
          {currentUser.$id === user.id && (
            <Route path="/liked-posts" element={<LikedPosts />} />
          )}

        <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />} />
          {currentUser.$id === user.id && (
            <Route path="/saved-posts" element={<SavedPosts />} />
          )}
      </Routes>
      <Outlet />
    </div>
  )
}

export default Profile