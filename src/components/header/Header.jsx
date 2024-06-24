import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../utils/api/requests';
import { changeEmail, changeId } from '../../utils/redux/userReducer';
import './header.css'

export default function Header () {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const[email, setEmail] = useState(user.email);

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
            <p className="email">{email}</p>
        </header>
    );
}