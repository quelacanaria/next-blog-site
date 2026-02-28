"use client";
import {FormEvent, useState} from 'react';
import { useAuth } from '@/AppContext/AuthContext';
import GetStarted from '../../../components/GetStarted';
import { useAddPost1Mutation} from '@/AppRedux/Slices/postApi';
import { UploadImage } from '@/lib/utils/UploadImage';

export default function CreatePost(){
    const [addPost1] = useAddPost1Mutation();
    const {user} = useAuth();
    const [picture, setPicture] = useState<File|null>(null);
    const [preview, setPreview] = useState<string|null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Public, setPublic] = useState<'public'|'private'>('public');

    const handleCreatePost = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{if(!title || !description || !user ) return;
            const image = await UploadImage(picture, user.id)
            const author = user.user_metadata.name;
            await addPost1({title, description, user_id:user.id, Public, author, image});
            setTitle('');
            setDescription('');
            setPicture(null);
            setPreview(null);
        }catch(error:any){console.log(error.message)}
    }
    return(
        <>
        {user ? ( 
            <>
          <div className="hero bg-base-200 min-h-screen p-8">
            <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                <form className="card-body" onSubmit={handleCreatePost}>
                    <label htmlFor="" className='mr-2'>
                    <input type="radio" name="radio-1" className="radio mr-1" checked={Public === 'public'} value={'public'} onChange={() => setPublic('public')} />
                    public</label>
                    <label htmlFor="" className='mr-2'>
                    <input type="radio" name="radio-1" className="radio mr-1" checked={Public === 'private'} value={'private'} onChange={() => setPublic('private')}/>
                    private</label>
                    <label htmlFor="">Image</label>
                    {preview === null ? '': <img src={preview} />}
                    <input 
                        onChange={(e) => {
                            if(e.target.files && e.target.files[0]){
                                setPicture(e.target.files[0])
                                setPreview(URL.createObjectURL(e.target.files[0]))
                            }
                        }}
                        type="file" 
                        accept='image/*' 
                        className="file-input file-input-bordered file-input-primary w-full file-input-sm" 
                    />
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