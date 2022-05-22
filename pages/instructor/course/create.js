import axios from "axios";
import { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseForm from "../../../components/forms/CourseForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const CreateCourse = () => {

    const router = useRouter();
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "9.99",
        paid: true,
        category: "",
        loading: false,
        image: ""
    });
    const [preview, setPreview] = useState("");
    const [uploadBtnText, setUploadBtnText] = useState("Upload Image");

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
                    // image: uri.replace(/^data:image\/\w+;base64,/, '')
                }})
                // try {
                //     let { data } = await axios.post("/api/course/upload-image", {
                //         image: uri
                //     });
                //     console.log("Image upload ", data);
                //     setValues({...values, loading: false})
                // } catch (err) {
                //     console.log(err);
                //     setValues({...values, loading: false})
                //     toast("Fail to upload")
                // }
            }
        )
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValues({...values, loading: true})
        if (!values.paid) setValues({...values, price: 0})

        try {
            const {data} = await axios.post("/api/course/create", {
                ...values
            })
            setValues({...values, loading: false})
            toast("Successfully create course");
            router.push("/instructor")
        } catch (error) {
            setValues({...values, loading: false})
            toast(error.response.data)
        }
    }

    return (
        <InstructorRoute>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Create Course</h1>
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

export default CreateCourse;