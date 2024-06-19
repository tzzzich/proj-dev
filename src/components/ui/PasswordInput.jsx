import { useFormContext } from "react-hook-form";
import InputField from "./InputField";

export default function PasswordInput () {
    const { register, formState: { errors } } = useFormContext();
    return (
        <InputField
            name="password"
            type="password"
            placeholder="Password"
            validation={{
            required: 'Password is required',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long'
            }
            }}
        />
    );
}