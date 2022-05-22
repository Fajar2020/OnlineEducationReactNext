import { Button, Progress, Switch } from "antd";
import ReactPlayer from "react-player";

const LessonForm = ({
    values,
    setValues,
    uploadBtnText,
    uploading,
    progress,
    handleAddLesson,
    handleOnChangeAddLesson,
    handleVideo,
    formTitle,
    isEdit,
}) => {
    return (
        <div className="container">
            <h4>{formTitle}</h4>
            <form onSubmit={handleAddLesson}>
                <input 
                type="text" 
                className="form-control square" 
                onChange={handleOnChangeAddLesson} 
                value={values.title} 
                placeholder="Title"
                name="title"
                autoFocus
                required
                />
                <textarea
                    name="content"
                    cols="7"
                    rows="7"
                    value={values.content}
                    className="form-control mt-3"
                    onChange={handleOnChangeAddLesson}
                    placeholder="Content"
                ></textarea>
                <label className="text-left mt-3">
                    Free Preview &nbsp;&nbsp;&nbsp;
                    <Switch onChange={() => setValues({...values, free_preview: !values.free_preview})} checked={values.free_preview}/>
                </label>
                <br />
                {isEdit && values.videoUrl && (
                    <div className="col pt-2">
                        <ReactPlayer 
                            url={values.videoUrl}
                            width="410px"
                            height="240px"
                            controls
                        />
                    </div>
                )}
                <label className="btn btn-dark btn-block text-left mt-3">
                    {uploadBtnText}
                    <input onChange={handleVideo} type="file" accept="video/*" hidden />
                </label>
                <br />
                
                {progress > 0 && <Progress className="d-flex justify-content-center pt-2" percent={progress} steps={10} />}
                <Button
                    onClick={handleAddLesson}
                    className="col mt-3"
                    size="large"
                    type="primary"
                    shape="round"
                    disabled={uploading}
                >
                    Save
                </Button>
            </form>
        </div>
    )
}

export default LessonForm;