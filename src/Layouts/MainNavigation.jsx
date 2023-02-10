import React from 'react'
import classes from './MainNavigation.module.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate, NavLink } from 'react-router-dom'
import { useUserAuth } from '../Context/Context'
import { toast } from 'react-hot-toast'

const MainNavigation = () => {

    const { logOut, user } = useUserAuth();
    const navigate = useNavigate()

    const logout = async () => {
        try {
            await logOut()
            navigate('/login')
            toast.success("Logged Out")
        } catch (err) {
            console.log(err.message)
            toast.error("Something Went Wrong")
        }
    }

    const tabs = [
        { value: 'Home', to: '/home' },
        { value: 'Filling Stations', to: '/fillingStations' },
        { value: 'Orders', to: '/orders' },
        { value: 'Deliveries', to: '/deliveries' }
    ]

    const tabs2 = [
        { value: 'Home', to: '/home' },
        { value: 'Customers', to: '/customers' },
        { value: 'Orders', to: '/customer-orders' },
    ]

    return (

        <header className={classes.header}>
            <h1 className={classes.title}>
                <img src='https://firebasestorage.googleapis.com/v0/b/power-fuel-22963.appspot.com/o/logo.png?alt=media&token=a7855622-05e2-40a1-b46c-b689b3e680b4' alt='logo' />
                Power<span className={classes.titleSub}>Fuel</span>
            </h1>
            <ul>

                {
                    user.uid === `${process.env.REACT_APP_ADMIN_ID}` ?
                        tabs.map((item, index) => (
                            <li key={index}><NavLink to={item.to}>{item.value}</NavLink></li>
                        )) :
                        tabs2.map((item, index) => (
                            <li key={index}><NavLink to={item.to}>{item.value}</NavLink></li>
                        ))
                }
            </ul>

            <div>
                <ul>
                    <li><NavLink to=''>Options<ArrowDropDownIcon className={classes.downArrow} /></NavLink>
                        <div className={classes.dropDown}>
                            <ul>
                                <li style={{ cursor: 'none' }}><NavLink to=''>{user.email}</NavLink></li>
                                <li><NavLink onClick={logout}>Log Out</NavLink></li>

                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default MainNavigation