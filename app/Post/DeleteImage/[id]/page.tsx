"use client";
import { useAuth } from "@/AppContext/AuthContext";
import { useDeleteAllComments1Mutation, useDeletePost1Mutation, useFetchPostsQuery, useUpdatePost1Mutation } from "@/AppRedux/Slices/postApi";
import { useParams } from "next/navigation"
import GetStarted from "@/components/GetStarted";
import { useRouter } from "next/navigation";
import { deleteImage } from "@/lib/utils/UploadImage";

export default function page(){
    const router = useRouter();
    const {id} = useParams();
    const {data: posts=[]}=useFetchPostsQuery();
    const post:any=posts.find((p:any) => p.id ===id);
    const [updatePost1]=useUpdatePost1Mutation();
    const {user}=useAuth();
    if(!post)return<p>loading</p>;

    const handleDeleteImage = async(post:any)=>{
        try{if(post.image){await deleteImage(post.image)}
            await updatePost1({...post, image: null})
            router.refresh();
            router.back();
        }catch(error:any){console.log(error.message)}
    }
    return(
        <>
        {user ? (
            <>
            <div className="flex flex-col gap-2 items-center p-0">
              <div className='hero bg-base-200 p-5'>
                <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm cursor-pointer" >
                  <div className="card-body">
                    <h3 className="text-error text-lg card-title">Are you sure you want to delete this Image?</h3>
                    {post.image && (<img src={post.image} />)}
                    <div className="justify-end card-actions">
                      <button className='btn btn-primary' onClick={()=>router.back()}>Back</button>
                      <button className='btn btn-error' onClick={()=>handleDeleteImage(post)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
        ):<GetStarted/>}
        </>
    )
}