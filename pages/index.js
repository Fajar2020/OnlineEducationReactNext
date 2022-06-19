import axios from "axios";
import { useRouter } from "next/router";
import CourseList from "../components/cards/CourseList";

const Index = ({courses}) => {
    const router = useRouter();
    
    return (
        <>
            <CourseList
                router = {router}
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