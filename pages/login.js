import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // state
    const { state: {user}, dispatch } = useContext(Context);
    
    // router
    const router = useRouter();
    useEffect(()=>{
        if(user) router.push("/")
    },[user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            setLoading(true);
            const {data}= await axios.post('/api/auth/login',{
                email,
                password
            });
            
            dispatch({
                type: "LOGIN",
                payload: data
            });

            // save in local storage
            window.localStorage.setItem("user", JSON.stringify(data));

            router.push("/user");
        } catch (err) {
            toast.error(err.response.data);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Login</h1>
            </div>
            <div className="container col-md-4 offset-md-4 mt-5 pb-5">
                <form onSubmit={handleSubmit}>
                    <input type="email" className="form-control mb-4 p-2" value={email} onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                    />

                    <input type="password" className="form-control mb-4 p-2" value={password} onChange={(e)=>setPassword(e.target.value)}placeholder="Enter Password"
                    required
                    />

                    <button type="submit" className="btn btn-block btn-primary p-2 w-100" disabled={!email || !password || loading}>
                        {loading ? <SyncOutlined spin />: "Submit"}
                    </button>
                </form>


                <p className="text-center pt-3">
                    Not yet registered?{" "}
                    <Link href="/register">
                        <a>Register</a>
                    </Link>
                </p>

                <p className="text-center">
                    <Link href="/forget-password">
                        <a className="text-danger">Forget your password?</a>
                    </Link>
                </p>
            </div>
        </>
    )
}


export default Login;