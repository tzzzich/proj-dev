import { useFormContext } from "react-hook-form";
import './file-input.css'
import UploadIcon from './../../../../assets/icons/upload.svg?react'
import { useState } from "react";

export default function FileInput ({ name, placeholder, setFile, required, disabled}) {
    const[value, setValue] = useState('');
    const { register, formState: { errors } } = useFormContext();

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      console.log(file);
      setFile(file);
      setValue(file ? file.name : null);
    };
    return (
      <div style={{width:"100%"}}>
      <div className="file-input-wrapper">
          <label htmlFor={name} className="file-label">
            {value ? <p>{value}</p> : placeholder}
            <UploadIcon/>
          </label>
          <input
            id={name}
            type="file"
            accept= {required && ".zip,.rar,.7z"}
            {...register(name, 
              {
                required: required ? `${placeholder} is required` : false
              }
            )}
            disabled={disabled}
            className="file-input"
            onChange={handleFileChange}
          />
      </div>
      <div className="error-placeholder">
        {errors[name] && !value && <p className="error-message">{errors[name]?.message}</p>}
      </div>
      </div>
    );
}