import { FormProvider, useForm } from 'react-hook-form';
import SponsorInfo from '../../components/sponsor-info/SponsorInfo';
import EmailInput from '../../components/ui/EmailInput';
import PasswordInput from '../../components/ui/PasswordInput';

import './welcome-page.css'

export default function LoginPage({}) {
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
                    <h2>Hello Again!</h2>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <EmailInput/>
                            <PasswordInput />
                        <button type="submit">Submit</button>
                        </form>
                    </FormProvider>
                    <p className="text-sm">Don't have an account yet?</p>
                    <h3>Register now</h3>
                </div>
            </div>
        </div>
    </div>
  );
}