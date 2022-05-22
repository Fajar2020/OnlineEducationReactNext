import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Tooltip, Button, Modal, List } from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown'
import LessonForm from '../../../../components/forms/LessonForm';
import { toast } from 'react-toastify';

const {Item} = List;

const CourseView = () => {
    const router = useRouter();
    const { slug } = router.query;

    const [uploadBtnText, setUploadBtnText] = useState("Upload Video");
    const [course, setCourse] = useState({});
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [formTitle, setFormTitle] = useState("Add Lesson");
    const [isEdit, setIsEdit] = useState(false);
    const [values, setValues] = useState({
        title: '',
        content: '',
        video: {},
        free_preview: false
    });
    
    
    useEffect(() => {
        loadCourse()
    }, [slug])

    const loadCourse = async () => {
        const {data} = await axios.get(`/api/course/${slug}`);
        if (data) setCourse(data);
    }

    const handleAddLesson = async (e) => {
        e.preventDefault();
        setUploading(true);
        setProgress(0);
        try {
            const videoData = new FormData();
            let response = null;
            if (isEdit) {
                videoData.append('video', values.video);
                videoData.append('title', values.title);
                videoData.append('content', values.content);
                videoData.append('free_preview', values.free_preview);
                videoData.append('previousVideo', values.videoUrl);
                videoData.append('lessonId', values._id);
                response = await axios.put(`/api/course/edit-lesson/${course._id}`, videoData, {
                    onUploadProgress: (e) => {
                        setProgress(Math.round((100*e.loaded)/e.total))
                    }
                })
            } else {
                videoData.append('video', values.video);
                videoData.append('title', values.title);
                videoData.append('content', values.content);
                videoData.append('free_preview', values.free_preview);
                response = await axios.post(`/api/course/add-lesson/${course._id}`, videoData, {
                    onUploadProgress: (e) => {
                        setProgress(Math.round((100*e.loaded)/e.total))
                    }
                })
                
            }
            setValues({
                title: '',
                content: '',
                video: {},
                free_preview: false
            });
            if (response) setCourse(response.data);
            setUploading(false);
            setUploadBtnText("Upload Video");
            toast('Successfully add lesson');
            setVisible(false);
        } catch (error) {
            toast("Fail to add lesson...")
            setUploading(false);
        }
        
    }

    const handleOnChangeAddLesson = async (e) => {
        setValues({...values, [e.target.name]: e.target.value })
    }

    const handleVideo = (e) => {
        let file = e.target.files[0];
        setUploadBtnText(file.name);
        setValues({...values, video: file})
    }

    const handleDrag = (e, index) => {
        e.dataTransfer.setData("itemIndex", index);
    }

    const handleDrop = async (e, index) => {
        const movingIndex = e.dataTransfer.getData("itemIndex");
        const allLessons = course.lessons;
        const movingItem = allLessons[movingIndex];
        allLessons.splice(movingIndex, 1); // take away drag item
        allLessons.splice(index, 0, movingItem); // push drag item to target place
        setCourse({...course, lessons: allLessons});

        try {
            const {data} = await axios.put(`/api/course/edit/${course._id}`, {
                lessons: values.lessons,
                saveFromDragDrop: true
            })
        } catch (error) {
            toast('fail to update lesson list')
        }
    }

    const handleDeleteLesson = async (index) => {
        const answer = window.confirm("Are you sure you want to delete ?");
        if (!answer) return;

        const allLessons = course.lessons;
        const item = allLessons.splice(index, 1); // take away drag item
        setCourse({...course, lessons: allLessons});

        try {
            const {data} = await axios.put(`/api/course/delete-lesson/${item[0]._id}`, {
                courseId: course._id
            })
            toast('Successfully delete lesson')
        } catch (error) {
            allLessons.splice(index, 0, item[0]);
            setCourse({...course, lessons: allLessons});
            toast('Fail to delete lesson')
        }
    }

    return (
        <InstructorRoute>
            <div className='container pt-3'>
                {course && (
                    <div className='container-fluid-pt-1'>
                        {/* <pre>
                            {JSON.stringify(course, null, 4)}
                        </pre> */}
                        <div className='media pt-2'>
                            <div className='media-body ps-2'>
                                <div className='row'>
                                    <div className='col-md-2'>
                                        <Avatar size={100} src={course.image ? course.image : '/course.png'} />
                                    </div>
                                    <div className='col-md-8'>
                                        <h5 className='mt-2 text-primary'>{course.name}</h5>
                                        <p style={{marginTop: "-10px"}}>
                                            {course.lessons && course.lessons.length} Lessons
                                        </p>
                                        <p style={{marginTop: "-15px", fontSize: "10px"}}>
                                            {course.category}
                                        </p>
                                        <p>
                                            {course.paid ? 'Price '+course.price : 'Free'}
                                        </p>
                                    </div>
                                    <div className='col-md-2'>
                                        <div className='mt-4'>
                                            <Tooltip title="Edit">
                                                <EditOutlined className='h5 pointer text-warning me-4' onClick={()=>router.push(`/instructor/course/edit/${slug}`)}/>
                                            </Tooltip>
                                            <Tooltip title="Publish">
                                                <CheckOutlined className='h5 pointer text-danger' />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col'>
                                <ReactMarkdown>{course.description}</ReactMarkdown>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <Button
                                onClick={() => {
                                    setVisible(true)
                                    setProgress(0);
                                    setFormTitle("Add Lesson");
                                    setIsEdit(false);
                                    setValues({
                                        title: '',
                                        content: '',
                                        video: {},
                                        free_preview: false
                                    });
                                }}
                                className="col-md-6 offset-md-2 text-center"
                                type="primary"
                                shape="round"
                                icon={<UploadOutlined />}
                                size="large"
                            >
                                Add Lesson
                            </Button>
                        </div>

                        <Modal
                            title="Lesson"
                            centered
                            visible={visible}
                            onCancel={()=>setVisible(false)}
                            footer={null}
                        >
                            <LessonForm 
                                values={values}
                                setValues={setValues}
                                uploadBtnText={uploadBtnText}
                                uploading={uploading}
                                progress={progress}
                                handleAddLesson={handleAddLesson}
                                handleOnChangeAddLesson={handleOnChangeAddLesson}
                                handleVideo={handleVideo}
                                formTitle={formTitle}
                                isEdit={isEdit}
                            />
                        </Modal>

                        <div className='row pb-5 mt-3'>
                            <div className='col lesson-list'>
                                <h4>List of lessons :</h4>
                                <List
                                    onDragOver={(e) => e.preventDefault()}
                                    itemLayout='horizontal'
                                    dataSource={course && course.lessons}
                                    renderItem={(item, index)=> (
                                        <Item
                                            draggable
                                            onDragStart={(e)=>handleDrag(e, index)}
                                            onDrop={(e)=>handleDrop(e, index)}
                                        >
                                            <Item.Meta 
                                                onClick={() => {
                                                    setVisible(true);
                                                    setProgress(0);
                                                    setValues({
                                                        ...item, 
                                                        ...{videoUrl: item.video, video: {}}
                                                    });
                                                    setFormTitle("Update Lesson")
                                                    setIsEdit(true)
                                                }}
                                                avatar={<Avatar>{index + 1}</Avatar>}
                                                title={item.title}
                                            ></Item.Meta>

                                            <DeleteOutlined 
                                                onClick={() => handleDeleteLesson(index)} 
                                                className="text-danger float-right"
                                            />
                                        </Item>
                                    )}
                                >

                                </List>
                            </div>
                        </div>
                        
                    </div>
                )}
            </div>
        </InstructorRoute>
    )
}

export default CourseView;