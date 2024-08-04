import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"


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
import { useUserContext } from "@/context/AuthContext"

const SignUpForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { checkAuthUser, isLoading: isUserLoading} = useUserContext()

    const {mutateAsync: createUserAccount, isPending: isCreatingAccount} = useCreateUserAccount();

    const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

    const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: ''
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    const newUser = await createUserAccount(values)
    
    if(!newUser){
      return toast({title: "Sign Up failed, please try again later."})
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password
  })
    if(!session){
      return toast({title: "Sign In failed, please try again later."})
  }
  const isLoggedIn = await checkAuthUser();
  if(isLoggedIn){
    form.reset();

    navigate('/')
  } else{
    return toast({title: "Sign Up failed, please try again later."})
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
            {isCreatingAccount || isSigningIn || isUserLoading ? 
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