import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { postValidation } from "@/lib/validation";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  const handleSubmit = async (value: z.infer<typeof postValidation>) => {
    if (!value.file || value.file.length === 0) {
      toast({
        title: "Please upload an image before posting.",
      });
      return;
    }

    if (post && action === "Update" && user.id == post.creator.$id) {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageURL: post.imageURL,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/${post?.creator.username}/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full max-w-5xl flex-col gap-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2 rounded-xl border border-dark-4 bg-dark-2 px-3 py-2.5 shadow-sm">
                  <MapPin className="h-4 w-4 text-light-4" />
                  <Input
                    type="text"
                    placeholder="Add location"
                    className="h-8 border-0 bg-transparent px-0 text-sm text-light-1 placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="relative">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea
                    className="shad-textarea custom-scrollbar pr-12 pb-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="absolute bottom-3 right-3">
                <FormControl>
                  <FileUploader
                    compact
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageURL}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;