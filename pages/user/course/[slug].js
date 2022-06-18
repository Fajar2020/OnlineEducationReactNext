import axios from "axios";
import { useRouter } from "next/router";
import { createElement, useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { CheckCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Item } = Menu;

const UserCourse = () => {
    const router = useRouter();
    const { slug } = router.query;

    const [clicked, setClicked] = useState(-1);
    const [collapse, setCollapse] = useState(false);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({lessons:[]});

    useEffect(()=>{
        if (slug) loadCourse();
    }, [slug])

    const loadCourse = async () => {
        setLoading(true);
        try {
            const {data} = await axios.get(`/api/course/student/course/${slug}`);
            setCourse(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast("Fail to load");
        }
    };

    const markCompleted = async () => {
        try {
            const { data } = await axios.post('/api/course/lesson/mark-completed', {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            setCourse(data);
        } catch (error) {
            console.log(error);
            toast("some problem appear please try again")
        }
    }

    const markIncomplete = async () => {
        try {
            const { data } = await axios.post('/api/course/lesson/mark-incomplete', {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            setCourse(data);
        } catch (error) {
            console.log(error);
            toast("some problem appear please try again")
        }
    }
    return (
    <StudentRoute>
        <div className="row">
            <div style={{maxWidth: 320}}>
                <Button onClick={() => setCollapse(!collapse)} className={collapse ? "text-primary mt-1 btn-block mb-2" : "text-primary mt-1 btn-block mb-2 width-full"}>
                    {createElement(collapse ? MenuUnfoldOutlined : MenuFoldOutlined)}
                    {!collapse && " Lessons"}
                </Button>
                <Menu 
                    defaultSelectedKeys={{clicked}} 
                    inlineCollapsed={collapse}
                    style={{height: '100vh', overflow: "scroll"}}
                >
                    {course.lessons.map((lesson, index) => (
                        <Item
                            onClick={()=> setClicked(index)}
                            key={index}
                            icon={<Avatar>{index + 1}</Avatar>}
                        >{lesson.title.substring(0, 30)}
                        {lesson.completed ? <CheckCircleOutlined className="float-end text-primary mt-2" /> : <MinusCircleOutlined className="float-end text-danger mt-2" />}</Item>
                    ))}
                </Menu>
            </div>

            <div className="col">
                {clicked !== -1 ? (
                <div className="container">
                    <div className="col alert alert-primary square">
                        <b>{course.lessons[clicked].title}</b>
                        {course.lessons[clicked].completed ? 
                        <span className="float-end pointer" onClick={markIncomplete}>
                            Mark as incompleted
                        </span> : 
                        <span className="float-end pointer" onClick={markCompleted}>
                            Mark as completed
                        </span>}
                        
                    </div>
                    {course.lessons[clicked].video && <div className="wrapper">
                        <ReactPlayer
                            className="player"
                            url={course.lessons[clicked].video}
                            width="100%"
                            height="100%"
                            controls
                            onEnded={() => markCompleted()}
                        />
                    </div>}
                    <ReactMarkdown>{course.lessons[clicked].content}</ReactMarkdown>
                </div>) : 
                (<div className="container text-center p-3">
                    <h2 className="fw-light">{course.name}</h2>
                    <img 
                        src={course.image} 
                        alt={course.name} 
                        style={{height: "200px", objectFit:"cover"}}
                        className="p-1 img-fluid img-thumbnail"
                    />
                    <p className="text-start">{course.description}</p>
                    <p className="lean text-primary mt-3">Click on each lesson to start learning</p>
                </div>)}
            </div>
        </div>
        
    </StudentRoute>
    );
};

export default UserCourse;