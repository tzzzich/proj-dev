import { FormProvider, useForm } from 'react-hook-form';
import SponsorInfo from '../../components/sponsor-info/SponsorInfo';
import EmailInput from '../../components/ui/EmailInput';
import PasswordInput from '../../components/ui/PasswordInput';
import TextInput from '../../components/ui/TextInput';

import './welcome-page.css'

export default function RegisterPage({}) {
  const methods = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
                    <h3>Login</h3>
                </div>
            </div>
        </div>
    </div>
  );
}
