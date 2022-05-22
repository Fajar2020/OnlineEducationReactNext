// follow stripe latter on make the one that possible for us

import { useContext, useState} from 'react';
import axios from "axios";
import { toast } from 'react-toastify';

import { Button } from 'antd';
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined} from '@ant-design/icons';

import { Context } from '../../context';

const BecomeInstructor = () => {
    const [ loading, setLoading ] = useState(false);
    const { state: {user}, dispatch } = useContext(Context);

    const becomeInstructor = () => {
        setLoading(true);
        axios.post('/api/instructor/make-instructor').then(res => {
            dispatch({
                type: "LOGIN",
                payload: res.data,
            });
            window.localStorage.setItem("user", JSON.stringify(res.data));
            window.location.href = '/instructor';
        }).catch(err => {
            console.log(err.response.status);
            toast('Fail to make request');
            setLoading(false);
        })
    }

    return (
    <>
        <div className="mt-0 p-5 jumbotron">
            <h1 className="text-white">Become Instructor</h1>
        </div>

        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 text-center'>
                    <div className='pt-4'>
                        <UserSwitchOutlined className='display-1 pb-3' />
                        <br />
                        <h2>Step up your game</h2>
                        <p className='lead text-warning'>
                            Just one click away to became instructor
                        </p>

                        <Button
                            className='mb=3'
                            type='primary'
                            block
                            shape='round'
                            icon = {loading ? <LoadingOutlined /> : <SettingOutlined />}
                            size = 'large'
                            onClick={becomeInstructor}
                            disabled= {
                                (user && user.role && user.role.includes('Instructor')) || loading
                            }
                        >
                            { loading ? "Processing..." : "Instructor Setup"}
                        </Button>

                        <p className='lead'>
                            Normally it will be payment setup using third party but in this case it will stop in our system
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default BecomeInstructor;