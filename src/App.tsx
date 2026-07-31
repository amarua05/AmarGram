import { Routes, Route } from 'react-router-dom'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import RootLayout from './_root/RootLayout'
import AuthLayout from './_auth/AuthLayout'
import { AllUsers, 
         CreatePost,
         EditPost,
         Explore,
         Home,
         LikedPosts,
         NotFound,
         PostDetails,
         Profile,
         Saved,
         UpdateProfile }
                  from './_root/pages'
import { Toaster } from "@/components/ui/toaster"
import VerifyEmailPage from "./_auth/VerifyEmailPage"
import Followers from './_root/pages/Followers'
import Following from './_root/pages/Following'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        { /* public routes*/}
        <Route element={<AuthLayout />}>
        <Route path='/sign-in' element={<SignInForm />}/>
        <Route path='/sign-up' element={<SignUpForm />}/>
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        </Route>



        {/* private roots*/}
        <Route path="/profile/:username/followers" element={<Followers />} />
        <Route path="/profile/:username/following" element={<Following />} />
        <Route element={<RootLayout />}>
        <Route index element={<Home />}/>
        <Route path='/explore' element={<Explore />} />
        <Route path='/saved' element={<Saved />} />
        <Route path='/all-users' element={<AllUsers />} />
        <Route path='/create-post' element={<CreatePost />} />
        <Route path='/liked-posts' element={<LikedPosts />} />
        <Route path='/update-post/:id' element={<EditPost />} />
        <Route path='/:username/posts/:id' element={<PostDetails />} />
        <Route path='/profile/:username/*' element={<Profile />} />
        <Route path='/update-profile/:id' element={<UpdateProfile />} />
        <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App