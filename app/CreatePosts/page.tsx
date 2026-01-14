"use client";
import {useSelector, useDispatch} from 'react-redux';
import {addPost, deletePost, updatePost} from '@/AppRedux/Slices/postSlice'
import {FormEvent, useState} from 'react';

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [update, setUpdate] = useState<any|null>(null);
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();
    const posts = useSelector((state:any) => state.posts);
    // console.log(posts);
    const handleRemovePost = (postId:any) => {
        dispatch(deletePost(postId));
    }
    const handleCreatePost = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!title || !description) return;
        const newPost={
            id: Date.now(),
            title: title,
            description: description,
        }
        dispatch(addPost(newPost));
        setTitle('');
        setDescription('');
    }
    const handleUpdatePost = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(title === update.title || description === update.description)return;
        dispatch(updatePost(update));
    }
    return(
        <>
          <div className="hero bg-base-200 min-h-140">
            <div className="card w-96 bg-base-100 card-xl shadow-sm ">
                <form className="card-body" onSubmit={handleCreatePost}>
                    <label htmlFor="">Title</label>
                    <input className='input' type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder='title'/>
                    <label htmlFor="">Description</label>
                    <textarea className='textarea' rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder='description'/>
                    <div className="justify-end card-actions">
                    <button className="btn btn-success " >Create</button>
                    </div>
                </form>
            </div>
          </div>

        {posts ? (
            posts.map((post:any) => (
          <div className="hero bg-base-200 " key={post.id}>
            <div className="card w-96 bg-base-100 card-xl shadow-sm ">
                <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p>{post.id}</p>
                    <p>{post.description}</p>
                    <div className="justify-end card-actions">
                      <button className='btn btn-primary' onClick={() => setUpdate(post)} >Update</button>
                      <button className="btn btn-error " onClick={() => handleRemovePost(post.id)} >Delete</button>
                    </div>
                </div>
            </div>
          </div>
          ))
        ):(<p>No posts found.</p>)}
        
        {update !== null && (
          <div className="card w-96 bg-base-100 card-xl shadow-sm ">
                <form className="card-body" onSubmit={handleUpdatePost}>
                    <label htmlFor="">Title</label>
                    <input className='input' type="text" value={update.title} onChange={(e) => setUpdate({...update, title: e.target.value,})} placeholder='title'/>
                    <label htmlFor="">Description</label>
                    <textarea className='textarea' rows={3} value={update.description} onChange={(e) => setUpdate({...update, description: e.target.value,})} placeholder='description'/>
                    <div className="justify-end card-actions">
                    <button className='btn btn-error' onClick={() => setUpdate(null)} >Cancel</button>
                    <button className="btn btn-primary " >Update</button>
                    </div>
                </form>
            </div>
        )}
        </>
    )
}