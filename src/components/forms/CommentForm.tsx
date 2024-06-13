import { useUserContext } from '@/context/AuthContext';
import { Models } from 'appwrite'
import React from 'react'
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCreateComment } from '@/lib/react-query/queriesAndMutations';
import { z } from 'zod';
import { CommentValidation } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { DrawerClose, DrawerFooter } from '../ui/drawer';
import Button from '../ui/button';
import Loader from '../shared/Loader';

type CommentFormProps = {
    comment?: Models.Document;
    post?: Models.Document;
    action: "Create"
}

const CommentForm = ({ comment, post, action }: CommentFormProps) => {
    const { mutateAsync: createComment, isPending: isLoadingCreate } = useCreateComment();

    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            caption: comment ? comment?.caption : "", 
        }
    })

    async function onSubmit(values: z.infer<typeof CommentValidation>) {
        const newComment = await createComment({
            ...values,
            userId: user.id,
            postId: post?.$id,
        })

        if (!newComment) {
            toast({
                title: "Something went wrong. Please try again",
            })
        } else {
            toast({
                title: "Comment successful!"
            })
            window.location.reload();
        }
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full">
            <FormField 
                control={form.control}
                name="caption"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Textarea className="shad-textarea custom-scrollbar" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message"/>
                    </FormItem>
                )}
            />
            <DrawerFooter>
              <Button
                type="submit"
                className="form-input"
                disabled={isLoadingCreate}
              >
                {isLoadingCreate && <Loader />}
                {action} Comment
              </Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
    )
}

export default CommentForm