import axios from "axios";
import { useContext, useEffect, useState } from "react";
import UserRoute from "../../components/routes/UserRoute";
import { Context } from "../../context";
import Link from "next/link";
import { PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const UserIndex = () => {
    const {state: {user}}= useContext(Context);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCourses();
    }, [])

    const loadCourses = async () => {
        setLoading(true);
        try {
            const data = await axios.get('api/course/user-courses');
            setCourses(data.data);
            setLoading(false);
        } catch (error) {
            toast("Fail to load courses");
            setLoading(false);
        }
        
    }
    
    return (
        <UserRoute>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">User Dashboard</h1>
            </div>
            {loading && <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" />}
            {courses && courses.map(course => (<>
                <div key={course._id} className="media pt-2 pb-1">
                    <div className="media-body ps-2">
                        <div className="row">
                            <div className="col-md-10">
                                <table>
                                    <tr>
                                        <td>
                                        <Link href={`/user/course/${course.slug}`} className="pointer">
                                            <a>
                                            <Avatar size={100} shape="square" src={course.image ? course.image : "/course.png"} />
                                            </a>
                                        </Link>
                                        </td>
                                        <td>
                                            <div className="ms-2">
                                                <Link href={`/user/course/${course.slug}`} className="pointer">
                                                    <a><h5 className="mt-2 text-primary">{course.name}</h5></a>
                                                </Link>
                                                <p style={{marginTop: "-10px"}}>{course.lessons.length} lessons</p>
                                                <p style={{marginTop: "-10px"}} className="text-muted">By {course.instructor.name}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                            </div>
                            <div className="col-md-2 mt-3 text center">
                                <Link href={`/user/course/${course.slug}`}>
                                    <a><PlayCircleOutlined className="h2 pointer text-primary"/></a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>))}
        </UserRoute>
    )
}

export default UserIndex;