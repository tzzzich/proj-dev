import { useForm } from 'react-hook-form';

import './login.css'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    
  };

  return (
    <div className="content-wrapper">
      <div className="sponsor-info-wrapper">
        <div className="sponsor-info">
            <div className='image-holder sponsor-image'>
                <img src='https://placehold.co/600x400' alt="Sponsor Banner" className="sponsor-banner" />
            </div>
            <h2>SUBSCRIBE TO CaXaP</h2>
            <div className="credits-wrapper">
                <div className='credits'>
                    <p>Credits:</p>
                    <ul>
                        <li>Bazdyrev Alexander</li>
                        <li>Eliseev Yuri</li>
                        <li>Bakhman Vladimir</li>
                        <li>Bukharova Victoria</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>

      <div className="input-form-wrapper">
        <div className="login-form-wrapper">
          <div className="login-form">
            <h2>Hello Again!</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div >
                    <input
                    type="email"
                    placeholder="Email"
                    {...register('email', { 
                        required: 'Email is required', 
                        pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Invalid email address'
                        } 
                    })}
                    />
                    <div className="error-placeholder">
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                </div>
                <div>
                    <input
                    type="password"
                    placeholder="Password"
                    {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                        }
                    })}
                    />
                    <div className="error-placeholder">
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>
                </div>
              <button type="submit">Submit</button>
            </form>
            <p className="text-sm">Don't have an account yet?</p>
            <h3>Register now</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
