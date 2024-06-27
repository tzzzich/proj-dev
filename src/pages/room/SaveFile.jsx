import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FileInput from "../../components/ui/input/file-input/FileInput.jsx";
import {getTables} from "../../utils/api/requests/index.js";
import axios from "axios";

const parseTables = (tables) => {
    return tables.map((item) => {
        const transformInJson = item.data.reduce((acc, curr) => {
            for (const key in curr) {
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(curr[key])
            }
            return acc
        }, [])

        const labels = transformInJson[0]
        const attributes = transformInJson[transformInJson.length - 1]
        transformInJson.pop()
        transformInJson.shift()

        return  {
            fileName: item.name + ".msbt",
            version: item.version,
            isBigEndian: item.isBigEndian,
            useIndices: item.useIndices,
            useStyles: item.useStyles,
            useAttributes: item.useAttributes,
            useAttributeStrings: item.useAttributeStrings,
            bytesPerAttribute: item.bytesPerAttribute,
            hashSlotCount: item.hashSlotCount,
            atO1Numbers: item.atO1Numbers,
            encoding: item.encoding,
            labels: labels,
            columns: transformInJson,
            attributes: attributes
        }
    })
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

const base64encode = async (file) => {
    const text = await toBase64(file)
    return text.split(",")[1]
}

const downloadFile = (file) => {
    const url = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const base64ToFile = (base64String, filename) => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const file = new File([blob], filename, { type: blob.type });

    return file;
}

export default function SaveFile ({closeModal, roomId, roomName, usesMSBP}) {
    const [error, setErrors] = useState(null)
    const[file, setFile] = useState(null);

    const methods = useForm();

    const onSubmit = async(data) => {
        console.log(data);
        try {
            const tablesResponse = await getTables(roomId)

            const json = parseTables(tablesResponse.tables)
            let fileStr = null

            if (file !== null) fileStr = await base64encode(file)

            const fileMsbt = await axios.post("http://158.160.147.53:2223/api/msbt/sheetsToZip",
                {name: roomName, base64MsbpFile: fileStr, sheets: json})
            const newFile = base64ToFile(fileMsbt.data.fileContents, fileMsbt.data.fileDownloadName + ".zip");

            downloadFile(newFile);
            closeModal();
        }
        catch(error) {
            setErrors(error);
        }
    };

    return (
        <div className="form">
            <h2>Save project</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <p className='error-message'>{error? error.message : ''}</p>
                    <FileInput
                        setFile={setFile}
                        name={"zipWithMsbts"}
                        placeholder={"MSBP file"}
                        disabled={!usesMSBP}
                    />
                    <button type="submit">Create</button>
                </form>
            </FormProvider>
        </div>
    );
}