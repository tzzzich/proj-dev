import { Link } from 'react-router-dom'
import './login.css'

export default function LoginPage () {

    return (
        <div className="content-wrapper">

            <div className="sponsor-info">

            </div>

            <div className="input-form-wrapper">
                <div className="login-form-wrapper">
                    <div className="login-form">
                        <h2>Hello Again!</h2>
                        <input type="email" placeholder="Email" />
                        <input type="email" placeholder="Email" />
                        <button type="submit">Submit</button>
                        <p className="text-sm">Don't have an account yet?</p>
                        <h3>Register now</h3>
                    </div>
                </div>
            </div>

        </div>
    );
};