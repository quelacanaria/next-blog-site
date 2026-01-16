
"use client";
import { useSearchParams } from 'next/navigation';
import { useFetchPostsQuery, useUpdatePost1Mutation, useDeletePost1Mutation } from '@/AppRedux/Slices/postApi';
import { PaginationControlls } from '../../components/PaginationControlls';
import { useAuth } from '@/AppContext/AuthContext';
import { FormEvent, useState } from 'react';
import GetStarted from '../../components/GetStarted';
export default function Home() {  

const [user_id, setUser_id] = useState<string|null>(null)
const [update, setUpdate] = useState<any|null>(null);
const [title, setTitle] = useState('');
const [Public, setPublic] = useState('');
const [description, setDescription] = useState('');
  const [deletePost1] = useDeletePost1Mutation();
  const [updatePost1] = useUpdatePost1Mutation();
  const handleRemovePost = async(postId:any) => {
        try{
            const res:any = await deletePost1(postId);
            console.log(res.message)
        }catch(error:any){
            console.log(error.message)
        }}
  const handleUpdatePost = async(e:FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if(title === update.title || description === update.description)return;  
              await updatePost1(update); 
              setUpdate(null);
    }
  const searchParams = useSearchParams();
  const {user} = useAuth();
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Number(searchParams.get('per_page') ?? 5);

  const { data: posts = [] } = useFetchPostsQuery();

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const entries = posts.slice(start, end);
  if(!user)return ;
  return (
    <>
        <div className="flex flex-col gap-2 items-center p-5">
         {entries && user ? (   
            entries.filter((post: any) => post.Public === 'public')
            .map((post) => (
            <div key={post.id} className="hero bg-base-200 p-5">
                    <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">{post.title}</h2>
                            <p>{post.description}</p>
                            <p>{post.author}</p>
                            <div className="justify-end card-actions">
                            {post.user_id === user.id &&(
                            <>
                                <button className="btn btn-primary" onClick={() => setUpdate(post)}>Update</button>
                                <button className="btn btn-error" onClick={() => handleRemovePost(post.id)} >Delete</button>
                            </>)}
                            </div>
                        </div>
                    </div>
            </div>
            ))) : (<>{!user ? <GetStarted/>:<p>No posts found.</p>}</>)}
            <PaginationControlls hasNextPage={end < posts.length} hasPrevPage={start > 0} />
        </div>

        {update !== null && (
            <div className='w-full h-screen fixed top-[0px] left-[0px] bg-neutral-100 flex justify-center items-center px-4'>
                  <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm ">
                        <form className="card-body" onSubmit={handleUpdatePost}>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'public'} checked={update.Public === 'public'} onChange={(e) => setUpdate({...update, Public: e.target.value,})} />
                            public</label>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'private'} checked={update.Public === 'private'} onChange={(e) => setUpdate({...update, Public: e.target.value,})}/>
                            private</label>
                            <label htmlFor="">Title</label>
                            <input className='input w-full' type="text" value={update.title} onChange={(e) => setUpdate({...update, title: e.target.value,})} placeholder='title'/>
                            <label htmlFor="">Description</label>
                            <textarea className='textarea w-full' rows={3} value={update.description} onChange={(e) => setUpdate({...update, description: e.target.value,})} placeholder='description'/>
                            <div className="justify-end card-actions">
                            
                            <button className='btn btn-error' onClick={() => setUpdate(null)} >Cancel</button>
                            <button className="btn btn-primary " >Update</button>

                            </div>
                        </form>
                    </div>
            </div>)}

    </>    
  );
}
