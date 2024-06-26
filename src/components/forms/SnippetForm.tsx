import { useUserContext } from '@/context/AuthContext';
import { useCreateSnippet } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite'
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { SnippetValidation } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { Input } from '../ui/input';
import Button from '../ui/button';
import Loader from '../shared/Loader';

type SnippetFormProps = {
  snippet?: Models.Document;
  post?: Models.Document;
  action: "Create";
}

const SnippetForm = ({ snippet, post, action }: SnippetFormProps) => {

  console.log("Post in snippets:", post)
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
    }
  })

  async function onSubmit(values: z.infer<typeof SnippetValidation>) {
    console.log("onSubmit is being activated", values);
    try {
      console.log("Before calling createSnippet");
      const newSnippet = await createSnippet({
        ...values,
        userId: user.id,
        postId: post?.$id,
      });
      console.log("After calling createSnippet");
  
      if (!newSnippet) {
        toast({
          title: "Snippet creation failed. Please try again."
        });
      } else {
        toast({
          title: "Snippet successful!"
        });
      }
    } catch (error) {
      console.error("Error creating snippet:", error);
      toast({
        title: "Snippet creation failed. Please try again."
      });
    }
    navigate(-1);
  }
  


  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        console.log('Form is submitting');
        form.handleSubmit(onSubmit, (errors) => {
          console.log('Validation errors:', errors);
        })(e);
      }} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render = {({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                  fieldChange={field.onChange} 
                  mediaUrl={snippet?.imageUrl}
                  />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="form-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end pb-8">
          <Button 
          type="button" 
          className="form-button-cancel"
          onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="form-button-submit whitespace-nowrap"
            disabled={isLoadingCreate}
          >
            {action} Snippet
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SnippetForm