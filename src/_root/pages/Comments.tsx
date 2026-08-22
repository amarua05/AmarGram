import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { commentValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useCreateComment, useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useParams } from "react-router-dom"
import { useEffect } from "react"

const Comments = () => {
    const { toast } = useToast()
    const {mutateAsync: createComment, isPending: isCreatingComment} = useCreateComment();
    const { user, isAuthenticated } = useUserContext();
    const { id } = useParams();
    const { data: post} = useGetPostById(id || '');
    const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment:'',
      post: post?.$id,
    }
  })
  
  useEffect(() => {
    if (post?.$id) {
      form.reset({ comment: "", post: post.$id });
    }
  }, [post?.$id]);
 
  const handleSubmit = async(values: z.infer<typeof commentValidation>) => {
    if (!isAuthenticated || !user?.id) {
      return toast({ title: "Please log in to comment." });
    }

    const newComment = await createComment({
      ...values,
      username: user.username,
      user: user.id,
    });
    if(!newComment){
      return toast({title: "Comment failed, please try again later."})
    };
    form.reset({ comment: "", post: post?.$id });
  };
  
  if (!isAuthenticated) {
    return (
      <p className="small-regular text-light-3 mt-4 text-center">
        Log in to leave a comment.
      </p>
    );
  }

  return (
    <div>
    <Form {...form}>
      <div className="flex-1 w-full justify-start text-center">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full mt-4 items-center gap-2">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl className="w-full">
                  <Input type="text" placeholder='Add a comment...' className="shad-comment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingComment  ? 
            (<div className="flex-center gap-2">
              <Loader /> Loading...
            </div>)
             : 'Post'}
          </Button>
        </form>
      </div>
    </Form>
    </div>
  )
}

export default Comments