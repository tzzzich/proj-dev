import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FileInput from '../../components/ui/input/file-input/FileInput';
import InputField from '../../components/ui/input/InputField';
import axios from "axios";


const parseJsonFile = (json) => {
    return json.map((item) => {
        item.columns.unshift(item.labels)
        if (item.useAttributes) item.columns.push(item.attributes)

        const transformedArray = item.columns.reduce((acc, curr, index) => {
            curr.forEach((value, key) => {
                if (!acc[key]) {
                    acc[key] = {};
                }
                acc[key][index] = value;
            });
            return acc;
        }, []);

        const arr = new Array(item.columns.length).fill({})

        return {
            fileName: item.fileName.split(".")[0],
            version: item.version,
            isBigEndian: item.isBigEndian,
            useIndices: item.useIndices,
            useStyles: item.useStyles,
            useAttributes: item.useAttributes,
            useAttributeStrings: item.useAttributeStrings,
            bytesPerAttribute: item.bytesPerAttribute,
            atO1Numbers: item.atO1Numbers,
            encoding: item.encoding,
            attributes: item.attributes,
            data: transformedArray,
            columns: arr
        }
    })
}

export default function CreateForm ({closeModal}) {
    const [error, setErrors] = useState(null)
    const[file, setFile] = useState(null);

    const methods = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
        console.log(file);
        let formData = new FormData();
        formData.append("zipWithMsbts", file); 
        try {
            data.zipWithMsbts = file;
            await axios.post("http://158.160.147.53:2223/api/msbt/zipToSheets", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
                .then(async (fileStr) => {
                    const tables = parseJsonFile(fileStr.data)
    
                    await axios.post("http://158.160.147.53:6868/rooms/addRoom", {name: data.name, tableData: tables[0]}, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                        .then((data) => {
                            tables.shift()
                            Promise.all(tables.map((item) => {
                                return axios.post(`http://158.160.147.53:6868/tables/addTable?roomId=${data.data.roomId}`,
                                    { tableData: item }, {
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                                    }
                                }).then(() => {
                                    console.log("+")
                                    navigate(`/projects/${data.data.roomId}/table/${data.data.tableId}`);
                                })
                            }))
                        })
                })
          closeModal();
        }
        catch(error) {
            console.log(error);
            setErrors(error.response.data);
        }
    };

    return (
        <div className="form">
            <h2>Create project</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                <p className='error-message'>{error? error : ''}</p>
                <InputField
                    name={"name"}
                    type="text"
                    placeholder={"Project name"}
                    validation={{
                    required: `Project name is required`
                        }}
                />
                <FileInput
                    setFile={setFile}
                    name={"zipWithMsbts"}
                    placeholder={"Archive with MSBTs"}
                />
                <button type="submit">Create</button>
                </form>
            </FormProvider>
        </div>
    );
}