"use client";
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useFetchPostsQuery, useAddComment1Mutation, useFetchCommentsQuery, useDeleteComment1Mutation, useUpdateComment1Mutation, useUpdatePost1Mutation } from '@/AppRedux/Slices/postApi';
import { useAuth } from '@/AppContext/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFont, faImage, faUser } from "@fortawesome/free-solid-svg-icons";
import { deleteImage, UploadImage } from '@/lib/utils/UploadImage';
import GetStarted from '@/components/GetStarted';
import Dropdown from '@/components/Dropdown';

export default function page() {
    const {id} = useParams();
    const router = useRouter();
    const {data: posts = []}=useFetchPostsQuery();
    const post = posts.find((p:any) => p.id === id);
    const {user} = useAuth();
    const {data: comments = [], refetch } = useFetchCommentsQuery();
    const [addComment1] = useAddComment1Mutation();
    const [deleteComment1] = useDeleteComment1Mutation();
    const [updateComment1]=useUpdateComment1Mutation();
    const [comment, setComment] = useState('');
    const [picture, setPicture] = useState<File|null>(null);
    const [update, setUpdate] = useState<any|null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
     const [preview1, setPreview1] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement|null>(null);
    if(!post) return <p>no post</p>;
    
    const removeFile = () =>{
        if(inputRef.current){inputRef.current.value=''}
        setPreview(null);
        setPreview1(null);
        setPicture(null);
    }
    const handleDeleteImage = async(comment:any)=>{
            try{if(comment.image){await deleteImage(comment.image)}
                await updateComment1({...comment, image: null})
                setEditingId(null);
            }catch(error:any){console.log(error.message)}
        }
    const handleSubmitComment = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();  
        try{if(!user || !post|| comment.trim() === '')return;
            console.log(picture);
            const author = user.user_metadata.name;
            const image = await UploadImage(picture, user.id);
            await addComment1({comment, post_id:post.id, author, image})
            setComment('');
            setPicture(null);
            setPreview(null);
        }catch(error){console.log(error)}
    }
    const handleDeleteComment = async(comment:any) => {
        try{await deleteComment1(comment.id);
            if(comment.image){await deleteImage(comment.image)}
        }catch(error:any){console.log(error.message)}
    }
    const handleClickOpenFormText=(comment:any)=>{
        setUpdate(comment); 
        setEditingId(comment.id);
    }
    const handleUpdateCommentText = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            if(user && picture !== null){
                const image = await UploadImage(picture, user.id);
                if(update.image){await deleteImage(update.image)}
                await updateComment1({...update, image})
                setEditingId(null);
                setPreview1(null);
            }else if(user && picture === null){
                await updateComment1(update)
                setEditingId(null);
                setPreview1(null);
            }
        }catch(error:any){console.log(error.message)}
    }

    useEffect(() => {
        refetch();
    }, []);

  return (<>
  {user ? (
    <div className="flex flex-col gap-2 items-center p-0">
         <div key={post.id} className="hero bg-base-200 p-5">
                    <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm cursor-pointer" >
                        <div className="card-body">
                            <div className="flex items-center gap-2">
                            <div className="btn btn-soft btn-primary btn-circle"><FontAwesomeIcon icon={faUser} size="sm" /></div>
                            <p>{post.author}</p>
                            </div>
                            {post.image && (<img src={post.image} />)}
                            <h2 className="card-title">{post.title}</h2>
                            <p>{post.description}</p>
                            <form onSubmit={handleSubmitComment}>
                                <div className='flex items-center gap-2'>
                                    <input
                                        value={comment}
                                        onChange={(e)=>setComment(e.target.value)}
                                        className="input input-bordered w-full"
                                        placeholder="Write a comment..."
                                    />
                                    <label className='btn btn-primary' >
                                        <FontAwesomeIcon icon={faFile} size='lg' />
                                        <input type="file" accept='image/*' onChange={(e) => {
                                            if(e.target.files && e.target.files[0]){
                                                setPicture(e.target.files[0]);
                                                setPreview(URL.createObjectURL(e.target.files[0]))
                                            }
                                        }} ref={inputRef} hidden/>
                                    </label>
                                </div>
                                {preview !== null &&(
                                    <div className='relative p-2 w-fit' >
                                    <img src={`${preview}`} className='w-50 rounded'/>
                                    <button onClick={removeFile} className='btn btn-soft btn-md btn-primary font-bold absolute top-0 right-0' type='button' >x</button>
                                    </div>
                                )}
                                <button className="btn btn-primary btn-sm mt-2 w-full">
                                    Comment
                                </button>
                            </form>
                            {post && comments.filter((comment) => (comment.post_id === post.id)).map((comment) => (
                            <div className="w-full max-w-sm sm:max-w-md mt-6 space-y-3" key={comment.id}>
                                <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="btn btn-soft btn-primary btn-circle btn-xs">
                                            <FontAwesomeIcon icon={faUser} size="xs" />
                                        </div>
                                        <p className="text-sm font-medium">{comment.author}</p>
                                        {user.user_metadata.name === comment.author &&(
                                        <Dropdown sizes='xs' items={[
                                            {label:'edit', onClick:()=>handleClickOpenFormText(comment)},
                                            {label:'delete', onClick:()=>handleDeleteComment(comment)}
                                        ]} buttonLabel='' />)}
                                    </div>
                                    {comment.image && editingId !== comment.id &&(<img className='w-50' src={comment.image} />)}
                                    {comment.id !== editingId && (<p className="text-sm text-gray-700">{comment.comment}</p>)}
                                    {update && editingId === comment.id && (<>
                                            <form onSubmit={handleUpdateCommentText}>
                                                {preview1 === null ? (
                                                    update.image && (
                                                    <div className='relative p-2 w-fit' >
                                                      <img src={`${update.image}`} className='w-50 rounded'/>
                                                      <button onClick={()=>handleDeleteImage(comment)} className='btn btn-soft btn-md btn-primary font-bold absolute top-0 right-0' type='button' >x</button>
                                                    </div>
                                                )):(
                                                    <div className='relative p-2 w-fit' >
                                                      <img src={`${preview1}`} className='w-50 rounded'/>
                                                      <button onClick={removeFile} className='btn btn-soft btn-md btn-primary font-bold absolute top-0 right-0' type='button' >x</button>
                                                    </div>
                                                )}
                                                <div className='flex items-center gap-2'>
                                                    <input value={update.comment} onChange={(e)=>setUpdate({...update, comment: e.target.value})} className='input text-sm text-gray-700' />
                                                    <label className='btn btn-primary'><FontAwesomeIcon icon={faFile} size='lg' /><input onChange={(e) => {
                                                        if(e.target.files && e.target.files[0]){
                                                            setPicture(e.target.files[0]);
                                                            setPreview1(URL.createObjectURL(e.target.files[0]))
                                                        }
                                                    }} type='file' accept='image/*' hidden/></label>
                                                </div>
                                                <button className='btn btn-link' >Update</button>
                                                <button className='btn btn-link' onClick={()=>{setEditingId(null); setPicture(null); setPreview1(null)}} >Cancel</button>
                                            </form>
                                            </>
                                        )}
                                </div>
                            </div>))}
                        </div>
                    </div>
                </div>
            </div>
    ): <GetStarted/>}
 </> )
}


