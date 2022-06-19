import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseList from "../../../components/cards/CourseList";

const SearchCourse = () => {
    const router = useRouter();
    const {title} = router.query;
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        loadCourses();
    }, [title]);

    const loadCourses = async () => {
        try {
            const {data} = await axios.get(`/api/course?title=${title}`);
            setCourses(data);
        } catch (error) {
            toast('fail to load courses')
        }
    }

    return (
        <>
            <CourseList 
                router = {router}
                courses = {courses}
            />
        </>
    );
}

export default SearchCourse;