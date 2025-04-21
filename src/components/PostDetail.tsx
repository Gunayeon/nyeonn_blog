import {Link, useParams} from "react-router-dom";
import {useState,useEffect} from "react";
import { PostProps } from "./PostList";
import {doc, getDoc} from "firebase/firestore";
import { db } from "firebaseApp";
import Loader from "./Loader";


export default function PostDetail() {
    const [post, setPost] = useState<PostProps | null>(null);
    const params = useParams();

    const getPost = async (id:string) => {
        if(id) {
            const docRef =doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
        }
    };

    const handleDelte = () => {
        console.log('delete');
    }

    console.log(post);
    useEffect(() => {
        if (params?.id) getPost(params?.id);
    }, [params?.id]);

    
    return <>
    <div className="post__detail">
        {post ? ('') : <Loader />}
        <div className="post__box">
            <div className="post__title">
                {post?.title}
            </div>
            <div className="post__profile-box">
                <div className="post__profile" />
                <div className="post__author-name">{post?.email}</div>
                <div className="post__date">{post?.createAt}</div>
            </div>
            <div className="post__utils-box">
                <div className="post__delete" onClick={handleDelte}>삭제</div>
                <div className="post__edit">
                    <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                </div>
            </div>
            <div className="post__text post__text--pre-wrap">
                {post?.content}
            </div>
            
        </div>
    </div>

    </>
}