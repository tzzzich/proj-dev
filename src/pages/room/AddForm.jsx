import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import InputField from '../../components/ui/input/InputField';

export default function AddForm ({closeModal, func, name, placeholder}) {
    const [error, setErrors] = useState(null)

    const methods = useForm();

    const onSubmit = async(data) => {
      console.log(data);
      try {
        func(data);
        closeModal();
      }
      catch(error) {
        setErrors(error);
      }
    };

    return (
        <div className="form">
            <h2>{placeholder}</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <p className='error-message'>{error? error : ''}</p>
                <InputField
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    validation={{
                    required: `${placeholder} is required`
                        }}
                />
                <button type="submit">Submit</button>
                </form>
            </FormProvider>
        </div>
    );
}