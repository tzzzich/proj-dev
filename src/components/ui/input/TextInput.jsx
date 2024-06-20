import { useFormContext } from "react-hook-form";
import InputField from "./InputField";

export default function TextInput ({name}) {
    const { register, formState: { errors } } = useFormContext();
    return (
        <InputField
            name={name.toLowerCase()}
            type="text"
            placeholder={name}
            validation={{
            required: `${name} is required`
        }}
      />
    )
}