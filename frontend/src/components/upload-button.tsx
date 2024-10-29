import { useRef } from 'react';
import { FileButton } from '@mantine/core';

interface IUploadButtonProps {
  onChange: (files: File[]) => void;
  className?: string
}

export function UploadButton({ onChange }: IUploadButtonProps) {
  const fileInputRef = useRef(null);
  const handleFileChange = (newFiles: File[]) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    onChange(newFiles);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-4">
        <FileButton
          onChange={(e: any)=> {
            handleFileChange(e);
          }}
          multiple
          accept='.csv'
          ref={fileInputRef}
        >
          {(props) => (
            <button
              {...props}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-800 transition duration-200"
            >
              Upload CSV Files
            </button>
          )}
        </FileButton>
      </div>
    </div>
  );
}
