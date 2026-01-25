"use client";
import { useSearchParams } from 'next/navigation';
import { useFetchPostsQuery, useUpdatePost1Mutation, useDeletePost1Mutation, useDeleteAllComments1Mutation, useFetchCommentsQuery } from '@/AppRedux/Slices/postApi';
import { PaginationControlls } from '../../components/PaginationControlls';
import { useAuth } from '@/AppContext/AuthContext';
import { FormEvent, useEffect, useState } from 'react';
import GetStarted from '../../components/GetStarted';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { deleteAllImage } from '@/lib/utils/UploadImage';

export default function NewsFeed() {  
const router = useRouter();
const [user_id, setUser_id] = useState<string|null>(null)
const [update, setUpdate] = useState<any|null>(null);
const [picture, setPicture] = useState<File|null>(null);
const [screen, setScreen] = useState<"main"|"edit"|"image">("main");
const [preview, setPreview] = useState<string|null>(null);
  const [deletePost1] = useDeletePost1Mutation();
  const [deleteAllComments1] = useDeleteAllComments1Mutation();
  const [updatePost1] = useUpdatePost1Mutation();
  const { data: posts = [] } = useFetchPostsQuery();
  const {user} = useAuth();
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
        try{if(post.id){await deleteAllImage(post.id)}
            await deleteAllComments1(post.id)
            const res:any = await deletePost1(post.id)
            
            console.log(res.message)
        }catch(error:any){
            console.log(error.message)
        }}
  const handleUpdateImage = async(file: File|null, userId:string) => {
        if(!file) return null;
        const ext = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${ext}`;
        const {error} = await supabase.storage.from('postsImages')
                                              .update(fileName, file);
        if(error)throw error;
        const {data} = supabase.storage.from('postsImages')
                                              .getPublicUrl(fileName);
        return data.publicUrl;
  }
  const handleUpdatePost = async(e:FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if(!update.title || !update.description)return; 
              await updatePost1(update); 
              setUpdate(null);
              setScreen('main');
    }
  const EditImagePost = async(e:FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if(!update.title || !update.description || !user_id)return;  
              const image = await handleUpdateImage(picture, user_id)
              if(update.image){await deleteImageFromStorage(update.image)}
              await updatePost1({...update, image: image}); 
              setUpdate(null);
              setPreview(null);
              setScreen('main');
  }

  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Number(searchParams.get('per_page') ?? 5);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const entries = posts.slice(start, end);
  return (
    <>
    {screen==='main' && update === null &&(
        <div className="flex flex-col gap-2 items-center p-5">
         {entries && user ? (   
            entries.filter((post: any) => post.Public === 'public')
            .map((post) => (
            <div key={post.id} className="hero bg-base-200 p-5 ">
                    <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm cursor-pointer" >
                        <div className="card-body">
                            <h2 className="card-title">{post.title}</h2>
                            {post.image &&(<img src={post.image} alt={post.image} onClick={(e)=>{setScreen('image'); setUpdate(post)}} className='cursor-pointer' />)}
                            <p>{post.description}</p>
                            <p>{post.author}</p>
                            <div className="justify-end card-actions">
                                <button className='btn btn-accent' onClick ={() => router.push(`/Post/ViewPosts/${post.id}`)}>View</button>
                            {post.user_id === user.id &&(
                            <>
                                <button className="btn btn-primary" onClick={() => {setUpdate(post); setScreen('edit'); setPicture(null);}}>Update</button>
                                <button className="btn btn-error" onClick={() => handleRemovePost(post)} >Delete</button>
                            </>)}
                            </div>
                        </div>
                        <button className="btn btn-block" onClick ={() => router.push(`/Post/ViewPosts/${post.id}`)}>Comment</button>
                    </div>
            </div>
            ))) : (<>{!user ? <GetStarted/>:<p>No posts found.</p>}</>)}
            <PaginationControlls hasNextPage={end < posts.length} hasPrevPage={start > 0} />
        </div>)}

        {screen === 'edit' && update !==null && (
            <div className='w-full min-h-screen sticky top-[0px] left-[0px] bg-neutral-100 flex justify-center items-center p-8'>
                  <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm ">
                        <form className="card-body" onSubmit={handleUpdatePost}>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'public'} checked={update.Public === 'public'} onChange={(e) => setUpdate({...update, Public: e.target.value,})} />
                            public</label>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'private'} checked={update.Public === 'private'} onChange={(e) => setUpdate({...update, Public: e.target.value,})}/>
                            private</label>
                            <label>Image</label>
                            {update.image ? (<img src={update.image} alt={update.image} onClick={(e)=>{setScreen('image'); setUpdate(update)}} className='cursor-pointer'  />)
                                    :<button onClick={(e)=>{setScreen('image'); setUpdate(update)}} className='w-full btn btn-primary'>Add Image</button>}
                            <label htmlFor="">Title</label>
                            <input className='input w-full' type="text" value={update.title} onChange={(e) => setUpdate({...update, title: e.target.value,})} placeholder='title'/>
                            <label htmlFor="">Description</label>
                            <textarea className='textarea w-full' rows={3} value={update.description} onChange={(e) => setUpdate({...update, description: e.target.value,})} placeholder='description'/>
                            <div className="justify-end card-actions">
                            
                            <button className='btn btn-error' onClick={() => {setUpdate(null); setScreen('main'); setPreview(null)}} >Cancel</button>
                            <button className="btn btn-primary " >Update</button>

                            </div>
                        </form>
                    </div>
            </div>)}

        {screen === 'image' && update !==null && (
            <div className='w-full min-h-screen sticky top-[0px] left-[0px] bg-neutral-100 flex justify-center items-center p-8'>
                  <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm ">
                        <form className="card-body" onSubmit={EditImagePost}>
                            <label>Image</label>
                            {preview === null ? update.image && (<img src={update.image} alt={update.image} />) : <img src={preview} /> }
                            <input onChange={(e)=>{
                                    if(e.target.files && e.target.files[0]){
                                        setPicture(e.target.files[0])
                                        setPreview(URL.createObjectURL(e.target.files[0]))
                                    }}}
                                   type='file' 
                                   accept='image/*'
                                   className="file-input file-input-bordered file-input-primary w-full file-input-sm" 
                            />
                            <button className='btn btn-error' onClick={() => {setUpdate(null); setScreen('main'); setPreview(null)}} >Cancel</button>
                            <button className="btn btn-primary " >Update</button>
                        </form>
                    </div>
            </div>)}

    </>    
  );
}
