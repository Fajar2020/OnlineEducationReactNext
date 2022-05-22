import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { Avatar, List, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseForm from "../../../../components/forms/CourseForm";
import LessonForm from '../../../../components/forms/LessonForm';


const {Item} = List;
const CourseEdit = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [values, setValues] = useState({});

    const [preview, setPreview] = useState("");
    const [uploadBtnText, setUploadBtnText] = useState("Upload Image");

    const [visible, setVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadBtnVideoText, setUploadBtnVideoText] = useState("Upload Image");

    useEffect(() => {
        loadCourse()
    }, [slug])

    const loadCourse = async () => {
        const {data} = await axios.get(`/api/course/${slug}`);
        if (data) {
            setValues({
                ...data,
                loading: false
            })
            setPreview(data.image)
            setUploadBtnText("Previous Image")
        }
    }
    
    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    };

    const handleImage = (e) => {
        let file = e.target.files[0];
        setPreview(window.URL.createObjectURL(file));
        setUploadBtnText(file.name);
        setValues({...values, loading: true})
        Resizer.imageFileResizer(
            file,
            720,
            500,
            "JPEG",
            100,
            0,
            async (uri) => {
                setValues({...values, ...{
                    loading: false,
                    image: uri,
                }})
            }
        )
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValues({...values, loading: true})
        if (!values.paid) setValues({...values, price: 0})

        try {
            const {data} = await axios.put(`/api/course/edit/${values._id}`, {
                ...values
            })
            setValues({...values, loading: false})
            toast("Successfully create course");
            router.push(`/instructor/course/view/${slug}`)
        } catch (error) {
            setValues({...values, loading: false})
            toast(error.response.data)
        }
    }

    const handleDrag = (e, index) => {
        console.log("HANDLE DRAG => ", index)
        e.dataTransfer.setData("itemIndex", index);
    }

    const handleDrop = async (e, index) => {
        console.log("HANDLE DROP => ", index)
        const movingIndex = e.dataTransfer.getData("itemIndex");
        const allLessons = values.lessons;
        const movingItem = allLessons[movingIndex];
        allLessons.splice(movingIndex, 1); // take away drag item
        allLessons.splice(index, 0, movingItem); // push drag item to target place
        setValues({...values, lessons: allLessons});

        try {
            const {data} = await axios.put(`/api/course/edit/${values._id}`, {
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

        const allLessons = values.lessons;
        const item = allLessons.splice(index, 1); // take away drag item
        setValues({...values, lessons: allLessons});

        try {
            const {data} = await axios.put(`/api/course/delete-lesson/${item[0]._id}`, {
                courseId: values._id
            })
            toast('Successfully delete lesson')
        } catch (error) {
            allLessons.splice(index, 0, item[0]);
            setValues({...values, lessons: allLessons});
            toast('Fail to delete lesson')
        }
    }


    // for lesson
    const handleUpdateLesson = async (e) => {
        console.log('handleUpdateLesson')
        e.preventDefault();
        setUploading(true);
        setProgress(0);
        try {
            const videoData = new FormData();
            videoData.append('video', currentItem.video);
            videoData.append('title', currentItem.title);
            videoData.append('content', currentItem.content);
            videoData.append('free_preview', currentItem.free_preview);
            videoData.append('previousVideo', currentItem.videoUrl);
            videoData.append('lessonId', currentItem._id);
            const {data} = await axios.put(`/api/course/edit-lesson/${course._id}`, videoData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100*e.loaded)/e.total))
                }
            })
            setCurrentItem({});
            setUploading(false);
            setUploadBtnVideoText("Upload Video");
            if (data) {
                setValues({
                    ...data,
                    loading: false
                })
                setPreview(data.image)
                setUploadBtnText("Previous Image")
            }
            toast('Successfully update lesson');
            setVisible(false);
        } catch (error) {
            toast("Fail to update lesson...")
            setUploading(false);
        }
        
    }

    const handleOnChangeLesson = async (e) => {
        setValues({...currentItem, [e.target.name]: e.target.value })
    }

    const handleVideo = (e) => {
        let file = e.target.files[0];
        setUploadBtnVideoText(file.name);
        setCurrentItem({...currentItem, video: file})
    }

    return (
        <InstructorRoute>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Update Course</h1>
            </div>
            <div className="pt-3 pb-3">
                <CourseForm 
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleImage={handleImage}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadBtnText={uploadBtnText}
                />
            </div>
            
        </InstructorRoute>
    )

}

export default CourseEdit;