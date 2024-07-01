import { useUserContext } from '@/context/AuthContext';
import { useCreateNote } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite'
import React from 'react'
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { NoteValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { DrawerClose, DrawerFooter } from '../ui/drawer';
import Button from '../ui/button';
import Loader from '../shared/Loader';

type NoteFormProps = {
  note?: Models.Document;
  snippet?: Models.Document;
  action: "Create";
}

const NoteForm = ({ note, snippet, action }: NoteFormProps) => {
  const { mutateAsync: createNote, isPending: isLoadingCreate } = useCreateNote();

  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof NoteValidation>>({
    resolver: zodResolver(NoteValidation),
    defaultValues: {
      caption: note ? note?.caption : "",
    }
  })

  async function onSubmit(values: z.infer<typeof NoteValidation>) {
    const newNote = await createNote({
      ...values,
      userId: user.id,
      snippetId: snippet?.$id
    })

    if (!newNote) {
      toast({
        title: "Something went wrong. Please try again."
      })
    } else {
      toast({
        title: "Comment created!"
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
            {isLoadingCreate ? ( <Loader />) : ("Create Comment") }
          </Button>
          <DrawerClose>
            <Button
              variant="outline"
              type="button"
            >
                Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </Form>
  )
}

export default NoteForm