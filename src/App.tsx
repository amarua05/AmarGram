import { Routes, Route } from 'react-router-dom'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import RootLayout from './_root/RootLayout'
import AuthLayout from './_auth/AuthLayout'
import { AllUsers, CreatePost, EditPost, Explore, Home, LikedPosts, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages'
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        { /* public routes*/}
        <Route element={<AuthLayout />}>
        <Route path='/sign-in' element={<SignInForm />}/>
        <Route path='/sign-up' element={<SignUpForm />}/>
        </Route>



        {/* private roots*/}
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
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App