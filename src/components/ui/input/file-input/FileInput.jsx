import { useFormContext } from "react-hook-form";
import './file-input.css'

export default function FileInput ({ name, placeholder, validation }) {
    const { register, formState: { errors } } = useFormContext();
    return (
      <div style={{width:"100%"}}>
      <div className="file-input-wrapper">
          <label htmlFor={name} className="file-label">
            {placeholder}
          </label>
          <input
            id={name}
            type="file"
            {...register(name, validation)}
            className="file-input"
          />
      </div>
      <div className="error-placeholder">
        {errors[name] && <p className="error-message">{errors[name]?.message}</p>}
      </div>
      </div>
    );
}