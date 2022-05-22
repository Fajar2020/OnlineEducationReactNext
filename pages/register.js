import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const {state:{user}} = useContext(Context);
    const router = useRouter();

    useEffect(()=>{
        if(user) router.push("/")
    },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // old approach ---> `${process.env.NEXT_PUBLIC_API}/auth/register`
            setLoading(true);
            const {data}= await axios.post('/api/auth/register',{
                name,
                email,
                password
            });

            setName("");
            setEmail("");
            setPassword("");
            setLoading(false);
            toast.success(data.msg);
        } catch (err) {
            toast.error(err.response.data);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">Register</h1>
            </div>
            <div className="container col-md-4 offset-md-4 mt-5 pb-5">
                <form onSubmit={handleSubmit}>
                    <input type="text" className="form-control mb-4 p-2" value={name} onChange={(e)=>setName(e.target.value)}
                    placeholder="Enter Name"
                    required
                    />

                    <input type="email" className="form-control mb-4 p-2" value={email} onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                    />

                    <input type="password" className="form-control mb-4 p-2" value={password} onChange={(e)=>setPassword(e.target.value)}placeholder="Enter Password"
                    required
                    />

                    <button type="submit" className="btn btn-block btn-primary p-2 w-100" disabled={!name || !email || !password || loading}>
                        {loading ? <SyncOutlined spin />: "Submit"}
                    </button>
                </form>


                <p className="text-center p-3">
                    Already registered?{" "}
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </p>
            </div>
        </>
    )
}


export default Register;