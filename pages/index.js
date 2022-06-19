import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import CourseList from "../components/cards/CourseList";

const Index = ({courses}) => {
    const router = useRouter();
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
    )
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.API}/course`);
    return {
        props: {
            courses: data
        }
    }
}

export default Index;