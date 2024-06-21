import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FileInput from '../../components/ui/input/file-input/FileInput';
import InputField from '../../components/ui/input/InputField';

export default function CreateForm ({closeModal}) {

    const methods = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
      console.log(data);
      navigate('100');
      closeModal();
    };

    return (
        <div className="form">
            <h2>Create project</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <InputField
                    name={"name"}
                    type="text"
                    placeholder={"Project name"}
                    validation={{
                    required: `Project name is required`
                        }}
                />
                <FileInput
                    name={"file"}
                    placeholder={"Archive with MSBTs"}
                />
                <button type="submit">Create</button>
                </form>
            </FormProvider>
        </div>
    );
}