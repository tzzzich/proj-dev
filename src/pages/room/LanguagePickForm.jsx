import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import SelectField from '../../components/ui/input/SelectField';
export default function LanguagePickForm ({closeModal, changeLanguage}) {
    const [error, setErrors] = useState(null);

    const methods = useForm();

    const onSubmit = async(data) => {
        console.log(data);
      try {
        changeLanguage({languageFrom: data.languageFrom, languageTo: data.languageTo});
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
                        name="languageFrom"
                        options={[
                            { value: 'en', label: 'English' },
                            { value: 'fr', label: 'French' },
                            { value: 'de', label: 'German'},
                        ]}
                        validation={{ required: 'Language from selection is required' }}
                    />

                    <SelectField
                        name="languageTo"
                        options={[
                            { value: 'ru', label: 'Russian' },
                            { value: 'en', label: 'English' },
                            { value: 'es', label: 'Spanish' },
                            { value: 'fr', label: 'French' },
                            { value: 'de', label: 'German'},
                        ]}
                        validation={{ required: 'Language to selection is required' }}
                    />

                    <button type="submit">Submit</button>
                </form>
            </FormProvider>
        </div>
    );
}
