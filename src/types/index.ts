
  export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
  userId: string;
  accountId: string;
  name: string;
  username: string;
  bio?: string;
  imageId: string;
  imageURL: URL | string;
  file: File[];
  email?: string;     
  password?: string; 
};
  
  export type INewPost = {
    userId: string;
    caption: string;
    file?: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageURL: URL;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    accountId: string;
    name: string;
    username: string;
    email: string;
    imageId: string;
    imageURL: string;
    bio: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type INewComment = {
    comment: string;
    post: string;
    user: string;
    username: string;
  }