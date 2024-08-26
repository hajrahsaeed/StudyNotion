import EditProfile from "./EditProfile";
import ChangeProfilePicture from "./ChangeProfilePicture";
import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";

export default function Settings() {
    return(
        <>
           <h1 className="mb-14 text-3xl font-medium text-richblack-5">
              Edit Profile
           </h1>
           {/* Change Profile Pictrue */}
           <ChangeProfilePicture/>

           {/* Edit Profile */}
           <EditProfile/>

           {/* Update Password */}
           <UpdatePassword/>

           {/* Delete Account */}
           <DeleteAccount/>
        </>
    )
}