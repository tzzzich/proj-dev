import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { getProfile, logout } from '../../utils/api/requests';
import { changeEmail, changeId } from '../../utils/redux/userReducer';
import './header.css'

export default function Header () {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[email, setEmail] = useState(user.email);

    function callAlert() {
        swal({
        title: "Are you sure?",
        text: "Are you sure you want to log out?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            logoutUser();
          swal("Successful logout", {
            icon: "success",
          }
          );
        } else {
        }
      });
    };

    async function logoutUser () {
        try {
            const response = await logout() ;
            dispatch(changeEmail(null));
            dispatch(changeId(null));
            navigate('/login')
        }
        catch (error) {
            swal("Error!", error, "error");
        }
    }

    useEffect(() => {
        async function getUserProfile(){
            try {
                const response = await getProfile();
                setEmail(response.data.email);
                dispatch(changeEmail( response.data.email));
                dispatch(changeId(response.data._id));
            }
            catch (error) {
                dispatch(changeEmail(null));
                dispatch(changeId(null));
                localStorage.setItem("token", null);
                console.log(error)
            }
        }
        getUserProfile();
        }, [email]);
    return (
        <header>
            <p>{'[Logo]'}</p>
            {localStorage.getItem('token') != 'null' &&
            <div className="auth-header">
                <p className="logout" onClick={callAlert}>Logout</p>
                <p className="email"onClick={() => navigate('/profile')}>{email}</p>
            </div>}
        </header>
    );
}