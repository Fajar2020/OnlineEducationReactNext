import { useContext } from "react";
import UserRoute from "../../components/routes/UserRoute";
import { Context } from "../../context";

const UserIndex = () => {
    const {state: {user}}= useContext(Context);
    
    return (
        <UserRoute>
            <div className="mt-0 p-5 jumbotron">
                <h1 className="text-white">User Page</h1>
            </div>
            <pre>
                {JSON.stringify(user, null, 4)}
            </pre>
        </UserRoute>
    )
}

export default UserIndex;