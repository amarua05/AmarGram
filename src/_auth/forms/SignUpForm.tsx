import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
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
import { signupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { sendVerificationEmail } from "@/lib/appwrite/api"


const SignUpForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount } = useSignInAccount();

    const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: ''
    },
  })
 
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    const usernameValidation = validateUsername(values.username);

    if (!usernameValidation.valid) {
      return toast({
        title: usernameValidation.message,
      });
    }
    const createdUser = await createUserAccount(values) as any;

    if (!createdUser || typeof createdUser !== 'object') {
      return toast({ title: "Sign Up failed, please try again later." })
    }

    try {
      await signInAccount({
        email: values.email,
        password: values.password,
      });

      const redirectUrl = (
        import.meta.env.VITE_APPWRITE_REDIRECT_URL
      ).trim();

      await sendVerificationEmail(redirectUrl);

      form.reset();
      navigate('/verify-email');
      return toast({
        title: "Account created. Check your email to verify it.",
      });
    } catch (error) {
      console.error('Verification email failed to send:', error);
      return toast({
        title: "Account created, but verification email could not be sent.",
      });
    }
  }
  
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/horizontal-logo.png" />
        <h2 className="h3-bold sm:h2-bold pt-5 sm:pt-12">Create a new account.</h2>
        <p className="text-light-2 small-medium md:base-regular mt-2">To use AmarGram, please enter your account details.</p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? 
            (<div className="flex-center gap-2">
              <Loader /> Loading...
            </div>)
             : 'Sign Up'}
          </Button>
          <p className="text-center text-small-regular text-light-2 mt-2">
              Already have an account? <Link to='/sign-in' className="text-primary-500 underline text-small-semibold ml-1">Sign in</Link>
          </p>
        </form>
    </div>
  </Form>
  )
}

export default SignUpForm