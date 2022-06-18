import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import UserNav from "../nav/UserNav";

const StudentRoute = ({children}) => {
    const [ok, setOk] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        fetchUser();
    },[])

    const fetchUser = async () => {
        try {
            const {data} = await axios.get("/api/auth/current-user");
            if(data.ok) setOk(true);
        } catch (error) {
            setOk(false);
            router.push("/login");
        }
    }
    return <>{!ok ? (<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />):(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-10">{children}</div>
            </div>
        </div>
    )}</>
}

export default StudentRoute;