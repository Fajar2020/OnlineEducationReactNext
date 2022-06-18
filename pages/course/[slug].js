import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CourseHighlight from "../../components/cards/CourseHighlight";
import CourseLessonsList from "../../components/cards/CourseLessonsList";
import PreviewVideoModal from "../../components/modal/PreviewVideoModal";
import { Context } from "../../context";

const SingleCourse = ({course}) => {
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState("");
    const {state: {user}} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [enroll, setEnroll] = useState(false);

    useEffect(()=> {
        if(user && user.courses) {
            user.courses.forEach(element => {
                if (element === course._id) {
                    setEnroll(true);
                }
            });
        }
    }, [])
    
    const handleEnrollment = async (e) => {
        e.preventDefault();  
        setLoading(true);
        if (!user) {
            router.push("/login")
            return;
        }
        if (enroll) {
            router.push(`/user/course/${course.slug}`)
            return;
        }
        try {
            const data = await axios.post("/api/course/enroll", {
                courseId : course._id,
            });
            toast(data.data.message);
            setLoading(false);
            router.push(`/user/${course.slug}`)
        } catch (error) {
            toast(error)
            setLoading(false);
        }
    }

    return (
        <>
            <CourseHighlight 
                course={course} 
                showModal={showModal} 
                preview={preview} 
                setShowModal={setShowModal} 
                setPreview={setPreview}
                user={user}
                loading={loading}
                handleEnrollment={handleEnrollment}
                enroll={enroll}
            />
            <PreviewVideoModal preview={preview} showModal={showModal} setShowModal={setShowModal}/>
            <CourseLessonsList lessons={course.lessons} setPreview={setPreview} setShowModal={setShowModal} showModal={showModal}/>
        </>
    )
}

export async function getServerSideProps({query}) {
    const {data} = await axios.get(`${process.env.API}/course?slug=${query.slug}`);
    let course = {};
    if (data.length) {
        course = data[0];
    }
    return {
        props: {
            course,
        }
    }
}

export default SingleCourse;