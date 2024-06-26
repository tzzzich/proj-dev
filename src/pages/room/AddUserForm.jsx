import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/ui/input/InputField';
import { addUser} from '../../utils/api/requests';

export default function AddUserForm ({closeModal, updateUsers, socket}) {
    const [error, setErrors] = useState(null)

    const methods = useForm();

    const onSubmit = async(data) => {
      console.log(data);
      try {
        const response = await addUser( localStorage.getItem('roomId'), data);
        updateUsers();
        socket.emit("send-users");
        closeModal();
      }
      catch(error) {
        setErrors(error);
      }
    };

    return (
        <div className="form">
            <h2>Add user</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <p className='error-message'>{error? error : ''}</p>
                <InputField
                    name={"email"}
                    type="text"
                    placeholder={"User email"}
                    validation={{
                    required: `User email is required`
                        }}
                />
                <button type="submit">Submit</button>
                </form>
            </FormProvider>
        </div>
    );
}