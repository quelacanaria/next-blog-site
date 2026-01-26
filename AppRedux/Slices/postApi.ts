import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  id: string;
  title: string;
  description: string;
  user_id: string;
  Public: string;
  author: string;
  image: string|null;
}
export interface Comment{
  id:string;
  comment: string;
  post_id: string;
  author: string;
  image: string|null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_ANON_KEY;

export const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Post', 'Comment'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${supabaseUrl}/rest/v1`,
    prepareHeaders: (headers) => {
      headers.set('apikey', supabaseAnonKey!);
      headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    
    fetchPosts: builder.query<Post[], void>({
      query: () => 'posts?select=*&order=created_at.desc',
      providesTags: ['Post'],
    }),

    fetchComments: builder.query<Comment[], void>({
      query: () => 'comments?select=*&order=created_at.asc',
      providesTags: ['Comment'],
    }),
    
    addPost1: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: 'posts',
        method: 'POST',
        body,
        headers: { Prefer: 'return=representation' },
      }),
      invalidatesTags: ['Post'],
    }),

    addComment1: builder.mutation<Comment, Partial<Comment>>({
      query:(body) =>({
        url:'comments',
        method: 'POST',
        body,
        headers:{Prefer: 'return=representation'},
      }),
      invalidatesTags: ['Comment'],
    }),

    updatePost1: builder.mutation<Post, Post>({
      query: ({ id, ...patch }) => ({
        url: `posts?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Post'],
    }),
    updateComment1: builder.mutation<Comment, Comment>({
      query: ({id, ...patch}) => ({
        url: `comments?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Comment']
    }),
    deletePost1: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    deleteAllComments1: builder.mutation<void, number>({
      query: (id) =>({
        url: `comments?post_id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment','Post'],
    }),
    deleteComment1: builder.mutation<void, number>({
      query: (id) => ({
        url: `comments?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useFetchCommentsQuery,
  useAddPost1Mutation,
  useAddComment1Mutation,
  useUpdatePost1Mutation,
  useUpdateComment1Mutation,
  useDeletePost1Mutation,
  useDeleteAllComments1Mutation,
  useDeleteComment1Mutation,
} = postsApi;
