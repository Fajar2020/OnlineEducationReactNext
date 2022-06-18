import { List, Avatar } from "antd";

const { Item } = List;
const CourseLessonsList = ({
    lessons,
    setPreview,
    setShowModal,
    showModal
}) => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col mt-3">
                        {lessons && <h4>{lessons.length} lessons</h4>}
                        <hr />
                        <List 
                            itemLayout="horizontal"
                            dataSource={lessons}
                            renderItem={(item, index)=>(
                                <Item>
                                    <Item.Meta avatar={<Avatar>{ index + 1 }</Avatar>} title={item.title} />
                                    {item.video && item.free_preview && (<span className="text-primary pointer text-decoration-underline" onClick={()=>{
                                        setPreview(item.video);
                                        setShowModal(!showModal);
                                    }}>Watch free video</span>)}
                                </Item>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseLessonsList;