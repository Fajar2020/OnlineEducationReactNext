import { useEffect, useState, useContext } from 'react';

import { Menu } from 'antd';
import { LoginOutlined, AppstoreOutlined, UserAddOutlined, LogoutOutlined, CarryOutOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axios from 'axios';

import { Context } from '../context';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
    const [current, setCurrent] = useState("");
    const {state, dispatch} = useContext(Context);
    const { user } = state;
    const router = useRouter();
 
    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async ()=>{
        dispatch({type: "LOGOUT"});
        window.localStorage.removeItem("user");
        const {data} = await axios.get("/api/auth/logout");
        toast(data.msg);
        router.push("/login");
    }

    return (
        <Menu mode="horizontal" selectedKeys={[current]}>
            <Item key="/" onClick={(e)=> setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link href='/'>
                    <a>App</a>
                </Link>
            </Item>

            { user && user.role && user.role.includes("Instructor") && (
            <Item key="/instructor/course/create" onClick={(e)=> setCurrent(e.key)} icon={<CarryOutOutlined />}>
                <Link href='/instructor/course/create'>
                    <a>Create Course</a>
                </Link>
            </Item>

            )}

            { user && user.role && user.role.includes("Instructor") && (
                <Item key="/instructor" onClick={(e)=> setCurrent(e.key)} icon={<TeamOutlined />}>
                    <Link href='/instructor'>
                        <a>Instructor</a>
                    </Link>
                </Item>
            )}

            { user && user.role && !user.role.includes("Instructor") && (
            <Item key="/user/became-instructor" onClick={(e)=> setCurrent(e.key)} icon={<TeamOutlined />}>
                <Link href='/user/became-instructor'>
                    <a>Become Instructor</a>
                </Link>
            </Item>

            )}

            { user === null && (
                <>
                    <Item key="/login" onClick={(e)=> setCurrent(e.key)} icon={<LoginOutlined />}>
                        <Link href='/login'>
                            <a>Login</a>
                        </Link>
                    </Item>

                    <Item key="/register" onClick={(e)=> setCurrent(e.key)} icon={<UserAddOutlined />}>
                        <Link href='/register'>
                            <a>Register</a>
                        </Link>
                    </Item>

                </>
            ) }
            
            { user !== null && (
                <SubMenu title={ user.name } style={{ marginLeft: 'auto' }}>
                    <ItemGroup>
                        <Item key="/user" >
                            <Link href='/user'>
                                <a>Dashboard</a>
                            </Link>
                        </Item>
                        <Item key="/logout" onClick={logout} icon={<LogoutOutlined />} >
                            Logout
                        </Item>
                    </ItemGroup>
                    
                </SubMenu>
            )}
            
        </Menu>
    )
}

export default TopNav;