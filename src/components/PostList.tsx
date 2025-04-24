import AuthContext from "context/AuthContext";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import {useContext, useEffect, useState} from "react"
import {Link} from "react-router-dom"
import { toast } from "react-toastify";

interface PostListProps {
    hasNavigation?: boolean;
    defualtTab?: TabType | CategoryType;
}

type TabType = "all" | "my";

// 게시글 작성 필드 타입 지정
export interface PostProps {
    id:string;
    title:string;
    email:string;
    summary:string;
    content: string;
    createdAt:string;
    updatedAt:string;
    uid:string;
    category?: CategoryType;
}

export type CategoryType="Frontend"|"Backend"|"Web"|"Native";
export const CATEGORIES: CategoryType[]=["Frontend", "Backend","Web","Native"];


export default function PostList({
    hasNavigation = true,
    defualtTab ="all",


    }:PostListProps) {
    const [activeTab, setActiveTab]=useState<TabType | CategoryType>(defualtTab);
    const [posts, setPosts] = useState<PostProps[]>([]);
    const {user} =useContext(AuthContext);
    const getPosts = async () => {
        // firestore데이터베이스에 존재하는 post문서를 불러옴
        
        setPosts([]);
        let postsRef = collection(db, "posts");
        let postsQuery;

        if(activeTab==='my' && user){
            // 나의 글만 필터링
            postsQuery = query(postsRef, where('uid', '==', user.uid),orderBy("createdAt", "desc") )

        } else if(activeTab==="all") {
            // 모든 글 보여주기
            postsQuery = query(postsRef, orderBy("createdAt", "desc"))

        } else {
            // 카테고리 글 보여주기
            postsQuery = query(postsRef, where("category","==",activeTab),orderBy("createdAt", "desc"))
        }
        // 불러온 문서들을 setPosts에 저장
        const datas = await getDocs(postsQuery);
        
        datas?.forEach((doc) => {
            const dataObj={...doc.data(),id:doc.id};
            setPosts((prev)=> [...prev, dataObj as PostProps]);
        })

    };

    console.log(posts);

    const handleDelete = async (id: string) => {
        const confirm=window.confirm("해당 게시글을 삭제하시겠습니까?");
        if(confirm && id) {
            await deleteDoc(doc(db, "posts", id));
            toast.success("게시글을 삭제했습니다.");
            getPosts()
            

        }
    }
    useEffect(() => {
        getPosts()
        console.log("ddd");
    },[activeTab])

    return (
        <>
            {hasNavigation && (
                <div className="post__navigation">
                    <div role="presentation" onClick={() => setActiveTab("all")} className={activeTab === 'all' ? "post__navigation--active": ""}>전체</div>
                    <div role="presentation" onClick={() => setActiveTab("my")} className={activeTab === 'my' ? "post__navigation--active": ""}>나의 글</div>
                    {CATEGORIES?.map((category) => (
                        <div key={category} role="presentation" onClick={() => setActiveTab(category)} className={activeTab === category ? "post__navigation--active" : ""}>
                            {category}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="post__list">
                {posts?.length>0 ? posts?.map((post, index) => (
                    <div key={post?.id} className="post__box">
                        <Link to={`/posts/${post?.id}`}>
                            <div className="post__profile-box">
                                <div className="post__profile" />
                                <div className="post__author-name">{post?.email}</div>
                                <div className="post__date">{post?.createdAt}</div>
                            </div>
                            <div className="post__title">{post?.title}</div>
                            <div className="post__text">
                                {post?.summary}
                            </div>
                        </Link>
                        {post?.email === user?.email &&(
                            <div className="post__utils-box">
                                <div className="post__delete" role="presentation" onClick={() => handleDelete(post.id as string)}>삭제</div>
                                <div className="post__edit">
                                    <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                                </div>
                            </div>
                        )}
                            
                     
                    </div>

                )):(<div className="post__no-post">게시글이 없습니다.</div>)}
            </div>
        </>
    );
}