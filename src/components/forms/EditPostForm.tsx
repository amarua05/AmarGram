import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { postValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useUpdatePost } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
    post?: Models.Document;
    action: 'create' | 'update'
}

const EditPostForm = ({ post }: PostFormProps) => {
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
    useUserContext()
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof postValidation>>({
        resolver: zodResolver(postValidation),
        defaultValues: {
          caption: post ? post?.caption : "",
          file: [],
          location: post ? post?.location : "",
          tags: post ? post?.tags.join(",") : ""
        },
      })
    
      const handleSubmit = async (value: z.infer<typeof postValidation>) => {
        const updatedPost = await updatePost({
          ...value,
          postId: post.$id,
          imageId: post.imageId,
          imageURL: post.imageURL,
        });
        if (!updatedPost) {
          toast({
            title: `This post failed. Please try again.`,
          });
        }
        return navigate(`/posts/${post.$id}`);
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full gap-9 max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Your Photo:</FormLabel>
              <FormControl>
              <img
          src={post.imageURL || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        /> 
             </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location.</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} />
             </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags(Separated by comma)</FormLabel>
              <FormControl>
                <Input className="shad-input" 
                placeholder="Art, Photography, Music" {...field}/>
             </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap">Edit</Button>    
        </div>
      </form>
    </Form>
  )
}

export default EditPostForm
