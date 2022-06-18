import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseForm from "../../../../components/forms/CourseForm";

const CourseEdit = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [values, setValues] = useState({});

    const [preview, setPreview] = useState("");
    const [uploadBtnText, setUploadBtnText] = useState("Upload Image");
    
    useEffect(() => {
        loadCourse()
    }, [slug])

    const loadCourse = async () => {
        const {data} = await axios.get(`/api/course/read/${slug}`);
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