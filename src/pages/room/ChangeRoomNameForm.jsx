import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/ui/input/InputField';
import { joinRoom, renameRoom } from '../../utils/api/requests';

export default function ChangeRoomNameForm ({closeModal, updateName, currentName}) {
    const navigate = useNavigate();

    const methods = useForm();

    const onSubmit = async(data) => {
      console.log(data);
      try {
        const response = await renameRoom( localStorage.getItem('roomId'), data);
        updateName(data);
        closeModal();
      }
      catch(error) {

        console.log(error)
      }
    };

    return (
        <div className="form">
            <h2>Change Room name</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <InputField
                    name={"name"}
                    type="text"
                    placeholder={"Room name"}
                    validation={{
                    required: `Room name is required`
                        }}
                    defaultValue={currentName}
                />
                <button type="submit">Submit</button>
                </form>
            </FormProvider>
        </div>
    );
}