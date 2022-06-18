import { LoadingOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import ReactPlayer from "react-player";

const CourseHighlight = ({
    course,
    showModal,
    preview,
    setShowModal,
    setPreview,
    user,
    loading,
    handleEnrollment,
    enroll
}) => {
    const { name, description, instructor, updatedAt, lessons, image, price, paid, category } = course;

    return (
        <>
        <div className="mt-0 p-5 jumbotron">
                <div className="row">
                    <div className="col-md-8">
                        <h1 className="text-light">{name}</h1>
                        <p className="lead">{description && description.substring(0,160)+'...'}</p>
                        <Badge count={category} style={{backgroundColor: "#03a9f4"}} className="mb-4" />
                        <p>Created by {instructor.name}</p>
                        <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
                        <h4 className="text-light">{paid ? `Price : ${price}` : 'Free'}</h4>
                    </div>
                    <div className="col-md-4">
                        {lessons[0].video && lessons[0].free_preview ? (
                            <div onClick={() => {
                                setPreview(lessons[0].video);
                                setShowModal(!showModal);
                            }}>
                                <ReactPlayer className="react-player-div" light={image} url={lessons[0].video} width="100%" height="225px" />
                            </div>
                        )  : (
                            <img src={image} alt={name} className="img img-fluid" />
                        ) }
                        {loading ? 
                        <div className="d-flex justify-content-center">
                            <LoadingOutlined className="mb-3 mt-3" style={{ fontSize: '30px'}} />
                        </div> : 
                        <Button
                            className="mb-3 mt-3"
                            block
                            disabled={loading}
                            shape="round"
                            size="large"
                            onClick={handleEnrollment}
                        >{user ? enroll ? "Go to my course" : "Enroll" : "Login to enroll"}</Button>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseHighlight;