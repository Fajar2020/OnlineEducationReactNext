import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import InstructorNav from "../nav/InstructorNav";

const InstructorRoute = ({children}) => {
    const [ok, setOk] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        fetchInstructor();
    },[])

    const fetchInstructor = async () => {
        try {
            const {data} = await axios.get("/api/instructor/current-instructor");
            if(data.ok) setOk(true);
        } catch (error) {
            console.log(error);
            setOk(false);
            router.push("/");
        }
    }
    return <>{!ok ? (<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />):(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2"><InstructorNav /></div>
                <div className="col-md-10">{children}</div>
            </div>
        </div>
    )}</>
}

export default InstructorRoute;