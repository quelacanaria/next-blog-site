"use client";
import {useSelector, useDispatch} from 'react-redux';
import {FormEvent, useEffect, useState} from 'react';
import { useAuth } from '@/AppContext/AuthContext';
import GetStarted from '../../components/GetStarted';
import { useAddPost1Mutation, useDeletePost1Mutation, 
    useUpdatePost1Mutation, useFetchPostsQuery } from '@/AppRedux/Slices/postApi';
import { Header } from '@/components/Header';

export default function CreatePost(){
    const [addPost1] = useAddPost1Mutation();
    const { user} = useAuth();
    const [user_id, setUser_id] = useState<string|null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Public, setPublic] = useState('');
    const handleCreatePost = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!title || !description || !user || !user_id) return;
        const author = user.user_metadata.name;
        await addPost1({title, description, user_id, Public, author});
        console.log(author);
        setTitle('');
        setDescription('');
    }
    useEffect(() => {
        if(!user)return;
        setUser_id(user.id);
    })
    return(
        <>
        {user ? ( 
            <>
          <div className="hero bg-base-200 min-h-screen px-4">
            <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                <form className="card-body" onSubmit={handleCreatePost}>
                    <label htmlFor="" className='mr-2'>
                    <input type="radio" name="radio-1" className="radio mr-1" value={Public} onChange={() => setPublic('public')} />
                    public</label>
                    <label htmlFor="" className='mr-2'>
                    <input type="radio" name="radio-1" className="radio mr-1" value={Public} onChange={() => setPublic('private')}/>
                    private</label>
                    <label htmlFor="">Title</label>
                    <input className='input w-full' type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder='title'/>
                    <label htmlFor="">Description</label>
                    <textarea className='textarea w-full' rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder='description'/>
                    <div className="justify-end card-actions">
                    <button className="btn btn-primary w-full" >Create</button>
                    </div>
                </form>
            </div>
          </div>
          </>
          ): (<GetStarted/>)}
           
        </>
    )
}