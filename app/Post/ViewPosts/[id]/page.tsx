"use client";
import React, { FormEvent, useState } from 'react'
import { useParams } from 'next/navigation';
import { useFetchPostsQuery, useAddComment1Mutation, useFetchCommentsQuery, useDeleteComment1Mutation, useUpdateComment1Mutation } from '@/AppRedux/Slices/postApi';
import { useAuth } from '@/AppContext/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFont, faImage, faUser } from "@fortawesome/free-solid-svg-icons";
import { deleteImage, UploadImage } from '@/lib/utils/UploadImage';
import GetStarted from '@/components/GetStarted';

export default function page() {
    const {id} = useParams();
    const {data: posts = []}=useFetchPostsQuery();
    const post = posts.find((p:any) => p.id === id);
    const {user} = useAuth();
    const {data: comments = [] } = useFetchCommentsQuery();
    const [addComment1] = useAddComment1Mutation();
    const [deleteComment1] = useDeleteComment1Mutation();
    const [updateComment1] = useUpdateComment1Mutation();
    const [comment, setComment] = useState('');
    const [picture, setPicture] = useState<File|null>(null);
    const [update, setUpdate] = useState<any|null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingIdImg, setEditingIdImg] = useState<string | null>(null);
    if(!post) return <p>no post</p>;
    
    const handleSubmitComment = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();  
        try{if(!user || !post|| comment.trim() === '')return;
            console.log(picture);
            const author = user.user_metadata.name;
            const image = await UploadImage(picture, user.id);
            await addComment1({comment, post_id:post.id, author, image})
            setComment('');
            setPicture(null);
        }catch(error){console.log(error)}
    }
    const handleDeleteComment = async(comment:any) => {
        try{await deleteComment1(comment.id);
            if(comment.image){await deleteImage(comment.image)}
        }catch(error:any){console.log(error.message)}
    }
    const handleUpdateCommentText = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{await updateComment1(update)
            setEditingId(null);
        }catch(error:any){console.log(error.message)}
    }
    const handleUpdateCommentImage = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{if(!user)return;
            const image = await UploadImage(picture, user.id);
            if(update.image){await deleteImage(update.image)}
            await updateComment1({...update, image})
            setEditingIdImg(null);
        }catch(error:any){console.log(error.message)}
    }
  return (<>
  {user ? (
    <div className="flex flex-col gap-2 items-center p-5">
         <div key={post.id} className="hero bg-base-200 p-5 ">
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
                                            }
                                        }} hidden/>
                                    </label>
                                </div>
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
                                    </div>
                                    {comment.image && (<img className='h-10' src={comment.image} />)}
                                    {comment.id !== editingId && (<p className="text-sm text-gray-700">{comment.comment}</p>)}
                                    {update && editingId === comment.id && (<>
                                            <form onSubmit={handleUpdateCommentText}>
                                                <input value={update.comment} onChange={(e)=>setUpdate({...update, comment: e.target.value})} className='input text-sm text-gray-700' />
                                                <button className='btn btn-link' >Update</button>
                                                <button className='btn btn-link' onClick={()=>setEditingId(null)} >Cancel</button>
                                            </form>
                                            </>
                                        )}
                                    {update && editingIdImg === comment.id &&(
                                        <form onSubmit={handleUpdateCommentImage} >
                                            <div className='flex items-center gap-2'>
                                            <input type='text' value={update.comment} onChange={e => setUpdate({...update, comment: e.target.value})} className='input text-sm text-gray-700'/>
                                            <label className='btn btn-primary'><FontAwesomeIcon icon={faFile} size='lg' /><input onChange={(e) => {
                                                if(e.target.files && e.target.files[0]){
                                                    setPicture(e.target.files[0]);
                                                }
                                            }} type='file' accept='image/*' hidden/></label>
                                            </div>
                                            <button className='btn btn-link' >Update</button>
                                            <button className='btn btn-link' onClick={()=>setEditingIdImg(null)}>Cancel</button>
                                        </form>
                                    )}
                                    {user.user_metadata.name === comment.author && comment.id !== editingId && comment.id !== editingIdImg &&(
                                        <>
                                            <button className='btn btn-link' onClick={()=>handleDeleteComment(comment)} >Delete</button>
                                            <button className='btn btn-link' onClick={()=>{ setUpdate(comment); setEditingId(comment.id)}}>UpdateText</button>
                                            <button className='btn btn-link' onClick={()=>{ setUpdate(comment); setEditingIdImg(comment.id)}}>UpdateImage</button>
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
