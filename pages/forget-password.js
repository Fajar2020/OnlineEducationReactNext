import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import { useRouter } from 'next/router'


const ForgetPassword = () => {
    // state
    const [ email, setEmail ] = useState("");
    const [ success, setSuccess ] = useState(false);
    const [ code, setCode ] = useState("");
    const [ newPassword, setNewPassword] = useState("");
    const [ loading, setLoading] = useState(false);

    const { state: {user}} = useContext(Context);
    const router = useRouter();

    // redirect login user
    useEffect( ()=> {
        if (user) router.push("/");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/api/auth/forget-password", {email})
            setSuccess(true);
            toast("Check your email for secret code");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    }

    const handleResetSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/api/auth/reset-password", {
                email,
                code,
                resetPassword: newPassword
            });

            setEmail('');
            setCode('');
            setNewPassword('');
            setLoading(false)
            toast("Successfully update password")
            router.push("/login");
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    }


    return (
        <>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Forget Password</h1>
            </div>
            <div className="container col-md-4 offset-md-4 mt-5 pb-5">
                <form onSubmit={ success ? handleResetSubmit : handleSubmit }>
                    <input type="email" className="form-control mb-4 p-2" value={email} onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                    />

                    {success && <>
                        <input type="text" className="form-control mb-4 p-2" value={code} onChange={(e)=>setCode(e.target.value)}
                        placeholder="Enter Secret Code"
                        required
                        />
                        
                        <input type="password" className="form-control mb-4 p-2" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}
                        placeholder="Enter New Password"
                        required
                        />

                    </>
                    }

                    <button type="submit" className="btn btn-block btn-primary p-2 w-100" disabled={!email || loading}>
                        {loading ? <SyncOutlined spin />: "Submit"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default ForgetPassword;