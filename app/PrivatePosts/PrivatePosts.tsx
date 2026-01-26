"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useFetchPostsQuery, useUpdatePost1Mutation, useDeletePost1Mutation, useFetchCommentsQuery } from '@/AppRedux/Slices/postApi';
import { PaginationControlls1 } from '../../components/PaginationControlls1';
import { useAuth } from '@/AppContext/AuthContext';
import GetStarted from '../../components/GetStarted';
import { deleteImage } from '@/lib/utils/UploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function PrivatePosts() {  
const {user} = useAuth();
const router = useRouter();
const [deletePost1] = useDeletePost1Mutation();
const { data: posts = [] } = useFetchPostsQuery();
const {data:comments=[]}=useFetchCommentsQuery();
  const handleRemovePost = async(post:any) => {
        try{const res:any = await deletePost1(post.id);
            if(post.image){await deleteImage(post.image)}
            console.log(res.message)
        }catch(error:any){
            console.log(error.message)
        }}

  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Number(searchParams.get('per_page') ?? 5);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const post = posts.filter((post)=> post.user_id === user?.id && post.Public === 'private');
  const entries = post.slice(start, end);
  
  return (
    <>
    {user ? (
        <div className="flex flex-col gap-2 items-center p-10">
         {entries && user && (   
            entries.filter((post: any) => post.user_id === user.id && post.Public === 'private')
            .map((post) => (
                <div key={post.id} className="hero bg-base-200 p-4 sm:p-5">
                    <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <div className="flex items-center gap-2">
                                <div className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faUser} size="sm" /></div>
                                <p>{post.author}</p>
                            </div>
                            {post.image &&(<img src={post.image} />)}
                            <h2 className="card-title">{post.title}</h2>
                            <p>{post.description}</p>
                            <div className="justify-end card-actions">
                                <button className='btn btn-accent' onClick ={() => router.push(`/Post/ViewPosts/${post.id}`)}>View</button>
                            {post.user_id === user.id &&(
                            <>
                                <button className="btn btn-primary" onClick={() => router.push(`/Post/UpdatePosts/${post.id}`)}>Update</button>
                                <button className="btn btn-error" onClick={() => handleRemovePost(post)} >Delete</button>
                            </>)}
                            </div>
                        </div>
                        <p className='p-3'>{comments.filter(c=>c.post_id === post.id).length} comment</p>
                        <button className="btn btn-block" onClick ={() => router.push(`/Post/ViewPosts/${post.id}`)}>Comment</button>
                    </div>
                </div>
            ))) }
            <PaginationControlls1 hasNextPage={end < post.length} hasPrevPage={start > 0} />
        </div>
    ): <GetStarted/>}
    </>    
  );
}

