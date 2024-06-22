import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import SponsorInfo from '../../components/sponsor-info/SponsorInfo';
import EmailInput from '../../components/ui/input/EmailInput';
import PasswordInput from '../../components/ui/input/PasswordInput';
import { login } from '../../utils/api/requests';

import './welcome-page.css'

export default function LoginPage({}) {
  const methods = useForm();
  const navigate = useNavigate();

  const [error, setErrors] = useState(null)

  const onSubmit = async (data) => {
    console.log(data);

    try{
      await login(data);
      navigate("/projects")
    }
    catch(error) {
        setErrors(error);
    }
  };

  return (
    <div className="content-wrapper">
        <SponsorInfo/>
        <div className="input-form-wrapper">
            <div className="form-wrapper">
                <div className="form">
                    <h2>Hello Again!</h2>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <p className='error-message'>{error? error : ''}</p>
                            <EmailInput/>
                            <PasswordInput />
                        <button type="submit">Login</button>
                        </form>
                    </FormProvider>
                    <p className="text-sm">Don't have an account yet?</p>
                    <Link to="/register"><h3>Register now</h3></Link>
                </div>
            </div>
        </div>
    </div>
  );
}