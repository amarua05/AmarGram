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
    file: z.array(z.instanceof(File)).min(1, { message: "Please upload an image." }),
    location: z.string().min(2).max(100),
    tags: z.string(),
  })
  export const commentValidation = z.object({  
    comment: z.string().min(1, {message: 'Comment must have at least 1 character.'}).max(220),
    post:z.string(),
  })
  export const editProfileValidation = z
  .object({
    name: z.string().min(1, "Name is required.").max(50, "Name is too long."),
    username: z.string().min(3, "Username must be 3-20 characters.").max(20),
    email: z.string().email("Invalid email address."),
    bio: z.string().max(1000, "Bio must be under 1000 characters.").optional(),
    file: z.custom<File[]>().optional(),
    password: z.string().optional(),
  })
  .superRefine((data) => {
    
    if (data.email && !data.password) {

    }
  });