import { FormProvider, useForm } from 'react-hook-form';
import FileInput from '../../components/ui/FileInput';
import InputField from '../../components/ui/InputField';

export default function CreateForm ({closeModal}) {

    const methods = useForm();

    const onSubmit = (data) => {
      console.log(data);
      closeModal();
    };

    return (
        <div className="form">
            <h2>Create project</h2>
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
                <FileInput
                    name={"file"}
                    placeholder={"Archive with MSBTs"}
                    validation={{
                    required: 'Archive with MSBTs is required'
                    }}
                />
                <button type="submit">Create</button>
                </form>
            </FormProvider>
        </div>
    );
}