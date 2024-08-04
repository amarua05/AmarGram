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
import { signinValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignInForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { checkAuthUser, isLoading: isUserLoading} = useUserContext()

    const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

    const form = useForm<z.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: '',
      password: ''
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinValidation>) {
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
        <h2 className="h3-bold sm:h2-bold pt-5 sm:pt-12">Log In to your account.</h2>
        <p className="text-light-2 small-medium md:base-regular mt-3 text-center">Welcome back to AmarGram, please enter your account details.</p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
            {isSigningIn || isUserLoading ? 
            (<div className="flex-center gap-2">
              <Loader /> Loading...
            </div>)
             : 'Sign In'}
          </Button>
          <p className="text-center text-small-regular text-light-2 mt-2">
              Don't have an account? <Link to='/sign-up' className="text-primary-500 underline text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
    </div>
  </Form>
  )
}

export default SignInForm