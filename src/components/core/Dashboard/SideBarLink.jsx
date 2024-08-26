import React from 'react'
import * as VscIcons from "react-icons/vsc"
import * as AiIcons from "react-icons/ai"
import { useDispatch } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

const SideBarLink = ({link, iconName}) => {

    const Icon = VscIcons[iconName] || AiIcons[iconName];;
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) =>  {
        return matchPath({path:route},location.pathname);
    }

    return(
        <NavLink 
        to={link.path} 
        className={`relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-800" : 
            "bg-opacity-0 text-richblack-300"} transition-all duration-200`}
        >

            <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 first-letter
             ${matchRoute(link.path) ? "opacity-100" :"opacity-0"}`}
              >
            </span>

            <div className='flex items-center gap-x-2'>
                <Icon className="text-lg" />
                <span>{link.name}</span>
            </div>

        </NavLink>
    )
}

export default SideBarLink;