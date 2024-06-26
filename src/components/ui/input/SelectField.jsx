import { useFormContext } from 'react-hook-form';

export default function SelectField({ name, options, validation }) {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="select-field">
            <select {...register(name, validation)}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && <p className="error-message">{errors[name].message}</p>}
        </div>
    );
}
