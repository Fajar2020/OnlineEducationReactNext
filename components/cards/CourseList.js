import { useState } from "react";
import CourseCard from "./CourseCard";

const CourseList = ({
    router,
    courses
}) => {
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
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Online School</h1>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                    
                        <div className="col">
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    name="search" 
                                    value={search} 
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="search"
                                />
                            </div>
                        </div>
                    
                    </div>
                </form>
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
    );
}

export default CourseList;
