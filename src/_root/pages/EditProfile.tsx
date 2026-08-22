import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { validateUsername } from "@/utils/validateUsername"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { editProfileValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useUserContext } from "@/context/AuthContext"
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations"
import { useEffect, useState } from "react"

const EditProfile = () => {
   const { toast } = useToast()
  const navigate = useNavigate()
  const { user, setUser, isLoading } = useUserContext()

  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()

  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [showPasswordField, setShowPasswordField] = useState(false)

  const form = useForm<z.infer<typeof editProfileValidation>>({
    resolver: zodResolver(editProfileValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      bio: "",
      password: "",
    },
  })
  useEffect(() => {
    if (user?.id) {
      form.reset({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
      })
      setPreviewUrl(user.imageURL || "")
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    form.setValue("file", [file])
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleEmailChange = (value: string) => {
    form.setValue("email", value)
    // Appwrite requires the current password to confirm an email change,
    // so only surface the password field once the email actually differs
    setShowPasswordField(value.trim().toLowerCase() !== user?.email?.toLowerCase())
  }

  if (isLoading || !user?.id) {
    return <Loader />
  }

  async function onSubmit(values: z.infer<typeof editProfileValidation>) {
    const emailChanged =
      values.email.trim().toLowerCase() !== user?.email?.toLowerCase()

    if (emailChanged && !values.password) {
      form.setError("password", {
        message: "Enter your current password to change your email.",
      })
      return
    }

    const usernameChanged = values.username !== user?.username
    if (usernameChanged) {
      const usernameValidation = validateUsername(values.username)
      if (!usernameValidation.valid) {
        return toast({ title: usernameValidation.message })
      }
    }

    try {
      const updatedUser = await updateUser({
        userId: user.id,
        accountId: user.accountId,
        name: values.name,
        username: usernameChanged ? values.username.toLowerCase() : values.username,
        bio: values.bio,
        imageId: user.imageId,
        imageURL: user.imageURL,
        file: values.file || [],
        ...(emailChanged && { email: values.email, password: values.password }),
      })

      if (!updatedUser) {
        return toast({ title: "Update failed, please try again." })
      }

      setUser(updatedUser)
      toast({ title: "Profile updated." })
      navigate(`/profile/${updatedUser.username}`)
    } catch (error: any) {
      // Appwrite throws a specific error when the password is wrong
      if (error?.message?.toLowerCase().includes("password")) {
        form.setError("password", { message: "Incorrect password." })
        return
      }
      console.error("Profile update failed:", error)
      toast({ title: "Something went wrong, please try again later." })
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center flex-col gap-6 w-full max-w-md mx-auto">
        <h2 className="h3-bold sm:h2-bold">Edit Profile</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
          <div className="flex-center flex-col gap-3">
            <img
              src={previewUrl || "/assets/icons/profile-placeholder.svg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="text-primary-500 small-medium cursor-pointer">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showPasswordField && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea className="shad-textarea" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              className="shad-button_dark_4"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="shad-button_primary">
              {isUpdatingUser ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default EditProfile