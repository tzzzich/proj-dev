import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FileInput from '../../components/ui/input/file-input/FileInput';
import InputField from '../../components/ui/input/InputField';
import { createRoom } from '../../utils/api/requests';

export default function CreateForm ({closeModal}) {
    const [error, setErrors] = useState(null)

    const methods = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
        try {
          const response = await createRoom(data);
          console.log(response);
          navigate(`/projects/${response.roomId}/table/${response.tableId}`)
          closeModal();
        }
        catch(error) {
  
          setErrors(error);
        }
      closeModal();
    };

    return (
        <div className="form">
            <h2>Create project</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <p className='error-message'>{error? error : ''}</p>
                <InputField
                    name={"name"}
                    type="text"
                    placeholder={"Project name"}
                    validation={{
                    required: `Project name is required`
                        }}
                />
                <FileInput
                    name={"zipWithMsbts"}
                    placeholder={"Archive with MSBTs"}
                />
                <button type="submit">Create</button>
                </form>
            </FormProvider>
        </div>
    );
}