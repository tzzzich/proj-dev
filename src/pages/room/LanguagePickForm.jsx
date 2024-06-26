import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SelectField from '../../components/ui/input/SelectField';
export default function LanguagePickForm ({closeModal, changeLanguage}) {
    const [error, setErrors] = useState(null);

    const methods = useForm();

    const onSubmit = async(data) => {
        console.log(data);
      try {
        changeLanguage(data.language);
        closeModal();
      } catch(error) {
        setErrors(error.message);
      }
    };

    return (
        <div className="form">
            <h2>Select Language</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <p className='error-message'>{error ? error : ''}</p>
                    
                    <SelectField
                        name="language"
                        options={[
                            { value: 'en', label: 'English' },
                            { value: 'es', label: 'Spanish' },
                            { value: 'fr', label: 'French' },
                            { value: 'de', label: 'German'},
                        ]}
                        validation={{ required: 'Language selection is required' }}
                    />

                    <button type="submit">Submit</button>
                </form>
            </FormProvider>
        </div>
    );
}
