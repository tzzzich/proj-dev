import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import SponsorInfo from '../../components/sponsor-info/SponsorInfo';
import EmailInput from '../../components/ui/input/EmailInput';
import PasswordInput from '../../components/ui/input/PasswordInput';

import './welcome-page.css'

export default function LoginPage({}) {
  const methods = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    navigate("/projects");
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