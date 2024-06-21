import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/ui/input/InputField';

export default function JoinForm ({closeModal}) {
    const navigate = useNavigate();

    const methods = useForm();

    const onSubmit = (data) => {
      console.log(data);
      navigate(`/projects/${data.roomId}`)
      closeModal();
    };

    return (
        <div className="form">
            <h2>Join project</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <InputField
                    name={"roomId"}
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