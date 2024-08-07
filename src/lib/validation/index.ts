import { z } from "zod"

export const signupValidation = z.object({
    username: z.string().min(4, { message: 'Username must contain at least 4 characters.'}),
    name: z.string().min(2, { message: 'Name must contain at least 2 letters.'}),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must contain at least 8 characters.'})
  })
  export const signinValidation = z.object({  
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must contain at least 8 characters.'})
  })
  export const postValidation = z.object({  
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string()
  })
  export const commentValidation = z.object({  
    comment: z.string().min(1, {message: 'Comment must have at least 1 character.'}).max(220),
    post:z.string(),
  })