import axios from "axios";
import { useRouter } from "next/router";
import { useReducer, createContext, useEffect } from "react";

//initial state
const initialState = {
    user: null
};

//create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, user:action.payload};
        case "LOGOUT":
            return {...state, user:null};
        default:
            return state;
    }
}

//context provider
const Provider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const router = useRouter();

    useEffect(()=>{
        dispatch({
            type: "LOGIN",
            payload: JSON.parse(window.localStorage.getItem("user"))
        });
    },[]);

    axios.interceptors.response.use(
        function (response){
            // success call
            return response;
        },
        function (err){
            let res=err.response;
            if(res.status === 401 && res.config && !res.config.__isRetryRequest){
                return new Promise((resolve, reject)=>{
                    axios.get("/api/auth/logout")
                    .then((data)=>{
                        dispatch({type: "LOGOUT"});
                        window.localStorage.removeItem("user");
                        router.push("/login");
                    })
                    .catch((error)=>{
                        console.log(error);
                        reject(err);
                    })
                })
            }
            return Promise.reject(err);
        }
    )

    useEffect(()=>{
        const getCsrfToken = async () => {
            const {data} = await axios.get("/api/csrf-token");
            console.log(data);
            axios.defaults.headers["X-CSRF-Token"]= data.csrfToken;
        }

        getCsrfToken();
    },[]);

    return (
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    );
};

export { Context, Provider };