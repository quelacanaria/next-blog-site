"use client";

import { useSearchParams } from 'next/navigation';
import { useFetchPostsQuery, useUpdatePost1Mutation, useDeletePost1Mutation } from '@/AppRedux/Slices/postApi';
import { PaginationControlls1 } from '../../components/PaginationControlls1';
import { useAuth } from '@/AppContext/AuthContext';
import { FormEvent, useEffect, useState } from 'react';
import GetStarted from '../../components/GetStarted';
import { supabase } from '@/lib/supabase/client';
export default function PrivatePosts() {  
const [user_id, setUser_id] = useState<string|null>(null)
const [update, setUpdate] = useState<any|null>(null);
const [preview, setPreview] = useState<string|null>(null);
const [picture, setPicture] = useState<File|null>(null);
const [title, setTitle] = useState('');
const [Public, setPublic] = useState('');
const [description, setDescription] = useState('');
  const [deletePost1] = useDeletePost1Mutation();
  const [updatePost1] = useUpdatePost1Mutation();
  useEffect(() => {
            if(!user)return;
            setUser_id(user.id);
        })
  const getFileImages = (url:string) => {
    const parts = url.split('/postsImages/');
    return parts[1];
  }
  const deleteImageFromStorage = async(imageUrl:string) => {
    const filePath = getFileImages(imageUrl);
    const {error} = await supabase.storage.from('postsImages')
                                          .remove([filePath])
  }
  const handleRemovePost = async(post:any) => {
        try{
            const res:any = await deletePost1(post.id);
            if(post.image){await deleteImageFromStorage(post.image)}
            console.log(res.message)
        }catch(error:any){
            console.log(error.message)
        }}
  const updateImagePost = async(file: File|null, userId:string) => {
    if(!file) return null;
        const ext = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${ext}`;

        const {error} = await supabase.storage.from('postsImages')
                                              .update(fileName, file);
        if(error) throw error;
        const {data} = supabase.storage.from('postsImages') 
                                             .getPublicUrl(fileName);
        return data.publicUrl;
  }
  const handleUpdatePost = async(e:FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if(title === update.title || description === update.description || !user_id)return;  
              const image = await updateImagePost(picture, user_id);
              if(update.image){await deleteImageFromStorage(update.image)}
              await updatePost1({...update, image: image}); 
              setUpdate(null);
              setPreview(null)
    }
  const searchParams = useSearchParams();
  const {user} = useAuth();
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Number(searchParams.get('per_page') ?? 5);

  const { data: posts = [] } = useFetchPostsQuery();

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const entries = posts.slice(start, end);
  if(!user)return;
  return (
    <>
    {update === null && (
        <div className="flex flex-col gap-2 items-center p-5">
         {entries && user ? (   
            entries.filter((post: any) => post.user_id === user.id && post.Public === 'private')
            .map((post) => (
            <div key={post.id} className="hero bg-base-200 p-4 sm:p-5">
                    <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">{post.title}</h2>
                            {post.image &&(<img src={post.image} />)}
                            <p>{post.description}</p>
                            <p>{post.author}</p>
                            <div className="justify-end card-actions">
                            {post.user_id === user.id &&(
                            <>
                                <button className="btn btn-primary" onClick={() => setUpdate(post)}>Update</button>
                                <button className="btn btn-error" onClick={() => handleRemovePost(post)} >Delete</button>
                            </>)}
                            </div>
                        </div>
                    </div>
            </div>
            ))) : (<>{!user ? <GetStarted/>:<p>No posts found.</p>}</>)}
            <PaginationControlls1 hasNextPage={end < posts.length} hasPrevPage={start > 0} />
        </div>)}

        {update !== null && (
            <div className='w-full min-h-screen top-[0px] left-[0px] bg-neutral-100 flex justify-center items-center p-8'>
                  <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm ">
                        <form className="card-body" onSubmit={handleUpdatePost}>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'public'} checked={update.Public === 'public'} onChange={(e) => setUpdate({...update, Public: e.target.value,})} />
                            public</label>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'private'} checked={update.Public === 'private'} onChange={(e) => setUpdate({...update, Public: e.target.value,})}/>
                            private</label>
                            <label>Image</label>
                            {preview === null ? update.image && (<img src={update.image} />):<img src={preview} />}
                            <input  onChange={(e) => {
                                        if(e.target.files && e.target.files[0]){
                                            setPicture(e.target.files[0]);
                                            setPreview(URL.createObjectURL(e.target.files[0]));
                                        }
                                    }} 
                                    type="file"
                                    accept='image/*'
                                    className="file-input file-input-bordered file-input-primary w-full file-input-sm"                                                    
                            />
                            <label htmlFor="">Title</label>
                            <input className='input w-full' type="text" value={update.title} onChange={(e) => setUpdate({...update, title: e.target.value,})} placeholder='title'/>
                            <label htmlFor="">Description</label>
                            <textarea className='textarea w-full' rows={3} value={update.description} onChange={(e) => setUpdate({...update, description: e.target.value,})} placeholder='description'/>
                            <div className="justify-end card-actions">
                            
                            <button className='btn btn-error' onClick={() => {setUpdate(null); setPreview(null)}} >Cancel</button>
                            <button className="btn btn-primary " >Update</button>

                            </div>
                        </form>
                    </div>
            </div>)}

    </>    
  );
}
