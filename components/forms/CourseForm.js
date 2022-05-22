import { Select, Button, Avatar } from "antd";

const { Option } = Select;


const CourseForm = ({
    handleSubmit,
    handleChange,
    handleImage,
    values,
    setValues,
    preview,
    uploadBtnText
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={values.name}
                    onChange={handleChange}
                />
            </div>
            
            <div className="form-group pt-3">
                <textarea
                    name="description"
                    cols="7"
                    rows="7"
                    value={values.description}
                    className="form-control"
                    onChange={handleChange}
                    placeholder="Description"
                ></textarea>
            </div>
            
            <div className="row pt-3">
                <div className="col-md-4">
                    <div className="form-group">
                        <Select
                            style={{width: "100%"}}
                            size="large"
                            value={values.paid}
                            onChange={(v)=> setValues({...values, paid: !values.paid})}
                        >
                            <Option value={true}>Paid</Option>
                            <Option value={false}>Free</Option>
                        </Select>
                    </div>
                </div>

                {values.paid && (
                    <div className="col-md-4">
                        <div className="form-group">
                            <input
                                type="text"
                                name="price"
                                className="form-control"
                                placeholder="Price"
                                value={values.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                )}
            
            </div>
            
            <div className="form-group pt-3">
                <input
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="Category"
                    value={values.category}
                    onChange={handleChange}
                />
            </div>
            
            <div className="form-row pt-3">
                <div className="col">
                    <div className="form-group">
                        <label className="btn btn-outline-secondary btn-block text-left me-3">
                            {uploadBtnText}
                            <input 
                                type="file"
                                name="image"
                                onChange={handleImage}
                                accept="image/*"
                                hidden
                            />
                        </label>
                        {preview && (
                            <Avatar size={200} shape="square" src={preview}/>
                        )}
                    </div>
                    
                </div>

                
            </div>
            <div className="row mt-3">
                <div className="col">
                    <Button
                        onClick={handleSubmit}
                        disabled={values.loading}
                        className="btn btn-primary"
                        // icon={<SaveOutlined />}
                        loading={values.loading}
                        type="primary"
                        size="large"
                        shape="round"
                    >
                        {values.loading ? 'Saving...':'Save and Continue'}
                    </Button>
                </div>
            </div>
    
        </form>
    );
}

export default CourseForm;