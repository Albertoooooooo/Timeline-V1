import { useUserContext } from '@/context/AuthContext';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import SnippetStats from './SnippetStats';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import Loader from './Loader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import Button from '../ui/button';
import NoteForm from '../forms/NoteForm';

type SnippetCardProps = {
  snippet: Models.Document;
}

const SnippetCard = ({ snippet }: SnippetCardProps) => {
  const { user } = useUserContext();
  const [currentNotes, setCurrentNotes] = useState<Models.Document[]>([])
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);


  if (!snippet.creator) return;

  return (
    <div className="snippets-card bg-dark-2">
      <div className="lg:flex lg:flex-row">
        <img
          src={snippet?.imageUrl}
          alt="post"
          className="post_details-img"
        />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link to={`/profile/${snippet?.creator.$id}`} className="flex items-center gap-3">
              <img
              src={snippet?.creator?.imageUrl || "'/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
              />
            
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {snippet?.creator.name}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {multiFormatDateString(snippet?.$createdAt)}
                  </p>
                  -
                  <p className="subtle-semibold lg:small-regular">
                    {snippet?.location}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-center">
              <SnippetStats snippet={snippet} userId={user.id}/>
              <AlertDialog>
                <AlertDialogTrigger>
                  {isDeleting ? <Loader /> : (
                    <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                    className={`ghost_details-delete_btn ${user.id !== snippet?.creator.$id && "hidden"}`}
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
            <p className="word-break">{snippet?.caption}</p>
          </div>
        </div>
      </div>
      <div className="w-full py-3 px-3">
        <hr className="border border-cyan w-full mb-5"/>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
            <h3 className="flex body-bold w-full">
              Show more
            </h3>
            </AccordionTrigger>
            <AccordionContent>
              <>
                <div className="my-5">
                  <Drawer>
                    <DrawerTrigger>
                      <hr className="border border-cyan"/>
                      <Button className="border border-none hover:bg-dark-4">
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
                      <hr className="border border-cyan"/>
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
                          {loadingNotes ? (
                            <Loader />
                          ) : (
                            <ul className="flex flex-col flex-1 gap-9 w-full px-5 py-5">
                              {currentNotes.map((snippet: Models.Document) => (
                              <SnippetCard key={snippet.$id} snippet={snippet} />
                              ))}
                            </ul>
                          )}
                        </DrawerTitle>
                        <NoteForm />
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                </div>
              </>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>  
    </div>
  )
}

export default SnippetCard