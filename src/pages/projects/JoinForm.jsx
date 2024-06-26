import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/ui/input/InputField';
import { joinRoom } from '../../utils/api/requests';

export default function JoinForm ({closeModal}) {
    const [error, setErrors] = useState(null)
    const navigate = useNavigate();

    const methods = useForm();

    const onSubmit = async(data) => {
      console.log(data);
      try {
        const response = await joinRoom(data);
        navigate(`/projects/${response.roomId}/table/${response.tableId}`)
        closeModal();
      }
      catch(error) {

        setErrors(error);
      }
    };

    return (
        <div className="form">
            <h2>Join project</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <p className='error-message'>{error? error : ''}</p>
                <InputField
                    name={"invitation_code"}
                    type="text"
                    placeholder={"Invitation code"}
                    validation={{
                    required: `Invitation code is required`
                        }}
                />
                <button type="submit">Join</button>
                </form>
            </FormProvider>
        </div>
    );
}