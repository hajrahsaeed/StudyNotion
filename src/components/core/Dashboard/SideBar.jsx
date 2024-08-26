import React from 'react'
import {sidebarLinks} from "../../../data/dashboard-links";
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux';
import SideBarLink from './SideBarLink';
import { VscSettingsGear } from 'react-icons/vsc';
import {useNavigate } from 'react-router-dom';
import { VscSignOut } from 'react-icons/vsc';
import ConfirmationModel from '../../common/ConfirmationModel';
import { useState } from 'react';

const SideBar = () => {

    const {user, loading:profileLoading} = useSelector((state) => state.profile);
    const {loading:authLoading} = useSelector((state) => state.auth);
    const [confirmationModel, setConfirmationModel] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    if(profileLoading || authLoading){
        return (
            <div className='grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800'>
                Loading...
            </div>
        )
    }

    return(
        <div className='flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10'>

            <div className='flex flex-col'>
                {
                    sidebarLinks.map((link) => {
                        
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SideBarLink link={link} key={link.id} iconName={link.icon}/>
                        )
                        
                    })
                }
            </div>

            <div className='mx-auto mt-6 mb-6h-[1px] bg-richblack-700'></div>

            <div className='flex flex-col'>
                <SideBarLink
                  link={{name:"Settings", path:"dashboard/settings" }}
                  iconName={"VscSettingsGear"}
                  />

                <button onClick={ () =>setConfirmationModel( {
                    text1:"Are You Sure ?",
                    text2:"You will be Logged Out of your Account",
                    btn1Text:"Logout",
                    btn2Text:"Cancel",
                    btn1Handler: () => dispatch(logout(navigate)),
                    btn2Handler: () => setConfirmationModel(null),
                })}
                className='px-8 py-2 text-sm font-medium text-richblack-300'>

                    <div className='flex flex-row items-center gap-x-2'>
                        <VscSignOut className='text-lg'/>
                        <span>Logout</span>
                    </div>

                </button>
            </div>

            {confirmationModel && <ConfirmationModel modelData={confirmationModel}/>}

        </div>
    )
}

export default SideBar;