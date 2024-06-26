import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from '../../components/ui/input/InputField';

export default function RenameTableForm ({closeModal, renameTable, currentName}) {
    const [error, setErrors] = useState(null)

    const methods = useForm();

    const onSubmit = async(data) => {
      console.log(data);
      try {
        renameTable(data);
        closeModal();
      }
      catch(error) {
        setErrors(error);
      }
    };

    return (
        <div className="form">
            <h2>Change Table name</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <p className='error-message'>{error? error : ''}</p>
                <InputField
                    name={"name"}
                    type="text"
                    placeholder={"Table name"}
                    validation={{
                    required: `Table name is required`
                        }}
                    defaultValue={currentName}
                />
                <button type="submit">Submit</button>
                </form>
            </FormProvider>
        </div>
    );
}