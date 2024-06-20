import { FormProvider, useForm } from 'react-hook-form';
import InputField from '../../components/ui/input/InputField';

export default function JoinForm ({closeModal}) {

    const methods = useForm();

    const onSubmit = (data) => {
      console.log(data);
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