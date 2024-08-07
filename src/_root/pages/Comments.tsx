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

const Comments = () => {
    const { toast } = useToast()
    const {mutateAsync: createComment, isPending: isCreatingComment} = useCreateComment();
    const { user } = useUserContext();
    const { id } = useParams();
    const { data: post} = useGetPostById(id || '');
    const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment:'',
      post: post?.$id,
      
    }
  })
 
  // 2. Define a submit handler.
  const handleSubmit = async(values: z.infer<typeof commentValidation>) => {
    const newComment = await createComment({
      ...values,
      username: user.username,
      user: user.id,
    });
    location.reload()
    if(!newComment){
      return toast({title: "Comment failed, please try again later."})
    }
  }
  
  return (
    <div>
    <Form {...form}>
      <div className="w-full justify-center text-center">
        <p className="text-gray-400 small-medium md:base-regular mt-2">Leave A Comment.</p>
      
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-5 w-full mt-4 items-center justify-center">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl className="w-full">
                  <Input type="text" className="shad-input" {...field} />
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
             : 'Send'}
          </Button>
        </form>
    </div>
  </Form>
  </div>
  )
}

export default Comments