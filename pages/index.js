import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

const Index = ({courses}) => {
    return (
        <>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Online School</h1>
            </div>
            <div className="container-fluid">
                <div className="row">
                    {courses.map( course => (<div key={course._id} className="col-md-4">
                            <CourseCard course={course} />
                        </div>)
                    )}
                </div>
            </div>
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