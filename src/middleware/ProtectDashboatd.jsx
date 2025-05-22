import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import storeContext from '../context/storeContext'

const ProtectDashboatd = () => {

    const { store } = useContext(storeContext)
   

    if (store.userInfo) {
        console.log("logg")
        return <Outlet />
    } else {
        console.log("not logged in")
        return <Navigate to='/login' />
    }

}

export default ProtectDashboatd