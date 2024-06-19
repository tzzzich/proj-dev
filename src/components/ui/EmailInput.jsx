import { useFormContext } from "react-hook-form";
import InputField from "./InputField";

export default function EmailInput () {
    const { register, formState: { errors } } = useFormContext();
    return (
        <InputField
            name="email"
            type="email"
            placeholder="Email"
            validation={{
            required: 'Email is required',
            pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address'
            }
        }}
      />
    )
}