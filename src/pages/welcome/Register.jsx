import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import SponsorInfo from '../../components/sponsor-info/SponsorInfo';
import EmailInput from '../../components/ui/input/EmailInput';
import PasswordInput from '../../components/ui/input/PasswordInput';
import TextInput from '../../components/ui/input/TextInput';

import './welcome-page.css'

export default function RegisterPage({}) {
  const methods = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    navigate("/projects")
  };

  return (
    <div className="content-wrapper">
        <SponsorInfo/>
        <div className="input-form-wrapper">
            <div className="form-wrapper">
                <div className="form">
                    <h2>Get started!</h2>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <TextInput name='Username'/>
                            <EmailInput/>
                            <PasswordInput />
                        <button type="submit">Register</button>
                        </form>
                    </FormProvider>
                    <p className="text-sm">Already have an account?</p>
                    <Link to="/login"><h3>Login</h3></Link>
                </div>
            </div>
        </div>
    </div>
  );
}
