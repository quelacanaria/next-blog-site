import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  id: number;
  title: string;
  description: string;
  user_id: string;
  Public: string;
  author: string;
  image: string|null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_ANON_KEY;

export const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Post'],
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
      query: () => 'posts?select=*',
      providesTags: ['Post'],
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

    updatePost1: builder.mutation<Post, Post>({
      query: ({ id, ...patch }) => ({
        url: `posts?id=eq.${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Post'],
    }),

    deletePost1: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useAddPost1Mutation,
  useUpdatePost1Mutation,
  useDeletePost1Mutation,
} = postsApi;
