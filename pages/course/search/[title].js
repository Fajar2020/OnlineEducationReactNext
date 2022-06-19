import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseCard from "../../../components/cards/CourseCard";
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

    const [search, setSearch] = useState('');
    
    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`/course/search/${search}`);
    }

    return (
        <>
            <CourseList 
                search = {search}
                handleChange = {handleChange}
                handleSubmit = {handleSubmit}
                courses = {courses}
            />
        </>
    );
}

export default SearchCourse;