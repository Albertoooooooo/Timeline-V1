import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';
import Button from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useAddView, useDeletePost, useGetPostById, useGetPostComments, useGetPostSnippets, useGetUserPosts } from '@/lib/react-query/queriesAndMutations'
import { multiFormatDateString } from '@/lib/utils';
import { DrawerClose, Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentForm from '@/components/forms/CommentForm';
import CommentCard from '@/components/shared/CommentCard';
import { Models } from 'appwrite';
import { useEffect, useState } from 'react';
import { incrementPostViews } from '@/lib/appwrite/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SnippetCard from '@/components/shared/SnippetCard';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { data: post, isPending } = useGetPostById(id || "");
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
  const { data: postComments, isPending: isCommentLoading, refetch: refetchComments } = useGetPostComments(post?.$id);
  const { data: postSnippets, isPending: isSnippetLoading, refetch: refetchSnippets } = useGetPostSnippets(post?.$id);
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost();
  const { mutate: addView, isPending: isAddingView } = useAddView();

  const [currentComments, setCurrentComments] = useState<Models.Document[]>([])
  const [currentSnippets, setCurrentSnippets] = useState<Models.Document[]>([])
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingSnippets, setLoadingSnippets] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if(post?.$id) {
      setLoadingComments(true);
      refetchComments().then((response) => {
        setCurrentComments(response.data?.documents || []);
        setLoadingComments(false);
      })
  
    }
  }, [post?.$id, refetchComments])

  useEffect(() => {
    if(post?.$id) {
      setLoadingSnippets(true);
      refetchSnippets().then((response) => {
        setCurrentSnippets(response.data?.documents || []);
        setLoadingSnippets(false);
      })
  
    }
  }, [post?.$id, refetchSnippets])

  useEffect(() => {
    if (id) {
      console.log("this should only run once")
      handleAddView();
    }
  }, [id]);

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  ).slice(0, 3)

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await deletePost({ postId: id, imageId: post?.imageId })
      navigate(-1)
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddView = () => {
    if(id) {
      addView({postId: id})
    }
  }

  if (isPending || !post) {
    return <Loader />;
  }


  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="ui-button_ghost"
        >
          <img 
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !post ? <Loader /> : (
      <div className='post_details-card'>
        <img
          src={post?.imageUrl}
          alt="post"
          className="post_details-img"
        />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
              <img
              src={post?.creator?.imageUrl || "'/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
              />
            
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post?.creator.name}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {multiFormatDateString(post?.$createdAt)}
                  </p>
                  -
                  <p className="subtle-semibold lg:small-regular">
                    {post?.location}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4">
              <Link to={`/update-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && "hidden"}`}>
                <img
                  src="/assets/icons/edit.svg"
                  width={24}
                  height={24}
                  alt="edit"
                  className="invert-cyan"
                />
              </Link>
              <AlertDialog>
                <AlertDialogTrigger>
                  {isDeleting ? <Loader /> : (
                    <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                    className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"}`}
                    />
                  )}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <hr className="border w-full border-cyan"/>

          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>{post?.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post?.tags.map((tag:string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <PostStats post={post} userId={user.id}/>
          </div>
        </div>
      </div>

      
      )}

      <hr className={`${user.id !== post?.creator.$id ? "hidden" : "border border-cyan w-full"}`} />
      <h3 className={`${user.id !== post?.creator.$id ? "hidden" : "flex body-bold md:h3-bold w-full"}`}>
        Timeline
      </h3>
      <div className="snippet-button">
        <Link to={`/create-snippet/${post?.$id}`} className={`${user.id !== post?.creator.$id && "hidden"}`}>
          <div className="snippet-container">
            <img 
              src="/assets/icons/plus.svg"
              className="invert-cyan flex flex-center border border-cyan rounded-full mt-12"
              width={40}
              height={40}
            />
            <p className="text-light-4 mb-6">Add Snippets</p>
          </div>
        </Link>
        
      </div>

      <div className="w-full">
      {loadingSnippets ? (
          <Loader />
        ) : (
      <Accordion type="single" collapsible className="accordion-border">
          <AccordionItem value="item-1">
            <AccordionTrigger>
            <h3 className="flex body-bold md:h3-bold w-full">
              Existing Timeline
            </h3>
            </AccordionTrigger>
            <AccordionContent>
              <>
                <hr className="border border-cyan mx-5" />
                <ul className="flex flex-col flex-1 gap-9 w-full px-5 py-5">
                  {currentSnippets.map((snippet: Models.Document) => (
                    <SnippetCard key={snippet.$id} snippet={snippet} />
                  ))}
                </ul>
              </>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        )}
      </div>

      <hr className={`${user.id !== post?.creator.$id ? "hidden" : "border w-full border-cyan"}`} />
      <div className="flex w-full">
        <Drawer>
          <DrawerTrigger>
            <Button>
              <div className="flex w-full">
                <img
                  src={"/assets/icons/message-circle.svg"}
                  alt="comment"
                  className="invert-cyan cursor-pointer"
                  width={20}
                  height={20}
                />
                <p className="ml-2">Add comment</p>
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                <div className="flex">
                  Add Comment
                  <img 
                    src={"/assets/icons/corner-right-down.svg"}
                    alt="down-arrow"
                    className="invert-white ml-2"
                    width={20}
                    height={20}
                  />
                </div>
                </DrawerTitle>
              <CommentForm post={post} action="Create" />
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="w-full">
        {loadingComments ? (
          <Loader />
        ) : (
          <>
          <Accordion type="single" collapsible className="accordion-border">
          <AccordionItem value="item-1">
            <AccordionTrigger>
            <h3 className="flex body-bold md:h3-bold w-full">
              Comments
            </h3>
            </AccordionTrigger>
            <AccordionContent>
              <>
                <hr className="border border-cyan mx-5" />
                <ul className="flex flex-col flex-1 gap-9 w-full px-5 py-5">
                  {currentComments.map((comment: Models.Document) => (
                  <CommentCard key={comment.$id} comments={comment} />
                  ))}
                </ul>
              </>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </>
        )}
      </div>

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-cyan" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts || loadingComments ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}

      </div>
    </div>
  )
}

export default PostDetails;