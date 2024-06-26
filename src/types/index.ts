import { URL } from "url";

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
export type IUpdateUser = {
  userId: string;
  name: string;
  username: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  friends: string;
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type INewSnippet = {
  userId: string;
  postId: string | undefined;
  caption: string;
  file: File[];
  location?: string;
};

export type INewNote = {
  userId: string;
  snippetId: string | undefined;
  caption: string;
};

export type INewComment = {
  userId: string;
  postId: string | undefined;
  caption: string;
}

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};