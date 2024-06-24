import { useUserContext } from '@/context/AuthContext';
import { useCreateSnippet } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite'
import React from 'react'
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { SnippetValidation } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

type SnippetFormProps = {
  snippet?: Models.Document;
  action: "Create"
}

const SnippetForm = ({ snippet, action }: SnippetFormProps) => {

  const { mutateAsync: createSnippet, isPending: isLoadingCreate } = useCreateSnippet();

  const { user }= useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SnippetValidation>>({
    resolver: zodResolver(SnippetValidation),
    defaultValues: {
      caption: snippet ? snippet?.caption : "",
      file: [],
      location: snippet ? snippet?.location : "",
      tags: snippet ? snippet?.tags.join(",") : "",
    }
  })

  async function onSubmit(values: z.infer<typeof SnippetValidation>) {
    if(snippet && action === "Create") {
      const newSnippet = await createSnippet({
        ...values,
        userId: user.id,
      })

      if (!newSnippet) {
        toast ({
          title: "Snippet creation failed. Please try again."
        })
      }
    }

    navigate("/")
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render = {({ field  }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default SnippetForm