"use client";
import { useSearchParams } from 'next/navigation';
import { useFetchPostsQuery, useUpdatePost1Mutation, useDeletePost1Mutation, useDeleteAllComments1Mutation, useFetchCommentsQuery } from '@/AppRedux/Slices/postApi';
import { PaginationControlls } from '../../components/PaginationControlls';
import { useAuth } from '@/AppContext/AuthContext';
import { useEffect, useState } from 'react';
import GetStarted from '../../components/GetStarted';
import { useRouter } from 'next/navigation';
import { deleteAllImage, deleteImage, UploadImage } from '@/lib/utils/UploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/components/Dropdown';

export default function NewsFeed() {  
  const router = useRouter();
  const [user_id, setUser_id] = useState<string|null>(null);
  const [deletePost1] = useDeletePost1Mutation();
  const [deleteAllComments1] = useDeleteAllComments1Mutation();
  const { data: posts = [] } = useFetchPostsQuery();
  const {data: comments=[]}=useFetchCommentsQuery();
  const {user} = useAuth();
  
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Number(searchParams.get('per_page') ?? 5);
  const start = (page - 1) * perPage;
  const end = start + perPage;
    const post = posts.filter((post)=> post.Public === 'public');
  const entries = posts.slice(start, end);
  return (
    <>{user ? (
        <div className="flex flex-col gap-2 items-center p-0">
         {entries && user && (   
            entries.filter((post: any) => post.Public === 'public')
            .map((post) => (
            <div key={post.id} className="hero bg-base-200 p-5 ">
                    <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm " >
                        <div className="card-body">
                            <div className="flex items-center gap-2">
                                <div className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faUser} size="sm" /></div>
                                <p>{post.author}</p>
                                {post.user_id === user.id &&(
                                <Dropdown sizes='md' items={[
                                    { label: 'edit', onClick: ()=>router.push(`/Post/UpdatePosts/${post.id}`) },
                                    { label: 'delete', onClick: ()=>router.push(`/Post/DeletePosts/${post.id}`)}
                                ]} buttonLabel={''} />)}
                            </div>
                            {post.image &&(<img src={post.image} alt={post.image} />)}
                            <h2 className="card-title">{post.title}</h2>
                            <p>{post.description}</p>
                            <div className="justify-end card-actions">
                                <button className='btn btn-accent' onClick ={() => router.push(`/Post/ViewPosts/${post.id}`)}>View</button>
                            </div>
                        </div>
                        <p className='p-3'>{comments.filter(c=>c.post_id === post.id).length} comment</p>
                        <button className="btn btn-block" onClick ={() => router.push(`/Post/ViewPosts/${post.id}`)}>Comment</button>
                    </div>
            </div>
            ))) }
            <PaginationControlls hasNextPage={end < post.length} hasPrevPage={start > 0} />
        </div>
    ): <GetStarted/>}
    </>    
  );
}
