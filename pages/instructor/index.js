import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
    const paraInfoStyle = {marginTop: "-15px", fontSize: "10px"}
    const [courses, setCourses] = useState([]);

    useEffect(()=>{
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const { data } = await axios.get("/api/instructor/courses");
        if (data) setCourses(data);
    }
    return (
        <InstructorRoute>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Instructor Dashboard</h1>
            </div>
            {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}
            {courses && courses.map((course) => (
                <>
                    <div className="media pt-2">
                        <div className="media-body">
                            <div className="row">
                                <div className="col-md-2">
                                    <Avatar size={100} src={course.image ? course.image : '/course.png'} />
                                </div>
                                <div className="col-md-9">
                                    <Link href={`/instructor/course/view/${course.slug}`} className="pointer">
                                        <a className="h5 mt-2 text-primary">{course.name}</a>
                                    </Link>
                                    <p className="mt-2">{course.lessons.length} lessons</p>
                                    {course.lessons.length < 5 ? (
                                        <p style={paraInfoStyle} className="text-danger">To publish the course it required minimum five (5) lessons</p>
                                    ) : course.published ? (
                                        <p style={paraInfoStyle} className="text-success">Congratulations this course is published</p>
                                    ) : (
                                        <p style={paraInfoStyle} className="text-warning">This course is eligible to publish</p>
                                    )
                                    }
                                </div>
                                <div className="col-md-1">
                                    {course.published ? (<div><CheckCircleOutlined className="h5 pointer text-success" /></div>) : (<div><CloseCircleOutlined className="h5 pointer text-warning" /></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </>
            ))}
        </InstructorRoute>
    )
    
}

export default InstructorIndex;