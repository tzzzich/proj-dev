import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../../components/ui/input/EmailInput';
import TextInput from '../../components/ui/input/TextInput';
import { getProfile } from '../../utils/api/requests';
import './profile-page.css'

export default function ProfilePage () {
    const methods = useForm();
    const [data, setData] = useState(null);
    const [error, setErrors] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null') {
            navigate('/login');
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        console.log(data);

      };

    useEffect(() => {
        async function getUserProfile(){
            try {
                const response = await getProfile();
                setData(response.data);
            }
            catch (error) {
                localStorage.setItem("token", null);
                console.log(error)
            }
        }
        getUserProfile();
        }, []);
    return (
        <div className="profile-wrapper">
             <div className="input-form-wrapper profile">
                <div className="form-wrapper">
                    <div className="form">
                        <h2>Profile</h2>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)}>
                                <p className='error-message'>{error? error : ''}</p>
                                <TextInput name='Username' defaultValue={data?.username}/>
                                <EmailInput defaultValue={data?.email}/>
                            <button type="submit">Save</button>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </div>
        </div>
    );

}