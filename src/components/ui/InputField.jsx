import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function InputField ({ name, type, placeholder, validation }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="input-wrapper">
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
      />
      <div className="error-placeholder">
        {errors[name] && <p className="error-message">{errors[name]?.message}</p>}    
      </div>
    </div>
  );
};

