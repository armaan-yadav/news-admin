import React,{useContext} from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import storeContext from '../context/storeContext'

const ProtectRole = ({ role }) => {

    const { store } = useContext(storeContext)
    console.log(store.userInfo?.role)

    return <Outlet />
    if (store.userInfo?.role === role) {
        console.log("admin")
    } else {
        console.log("not admin")
        // fixme
        // return <Navigate to='/dashboard/unable-access' />
    }
}

export default ProtectRole

