import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  ScrollArea,
  Container,
  Title,
  Card,
  Group,
  Alert,
  Loader,
} from '@mantine/core';
import { UploadButton } from './upload-button';
import FileAccordion from './accordion';
import { useNavigate } from 'react-router-dom';
import ProcessedFilesTable from './table';

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [claims, setClaims] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processedFiles, setProcessedFiles] = useState<[]>([]);
  const [showProcessedFiles, setShowProcessedFiles] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleFileChange = (newFiles: File[]) => {
    const validFiles = validateFiles(newFiles);
    if (validFiles.length === 0) {
      return;
    }
    const existingFileNames = new Set(files.map(file => file.name));
    const filesToAdd = validFiles.filter(file => !existingFileNames.has(file.name));
    if (filesToAdd.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    }
  };

  const validateFiles = (newFiles: File[]): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    newFiles.forEach((file) => {
      const fileType = file.type;
      if (fileType === 'text/csv' || fileType === 'application/vnd.ms-excel') {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`Invalid file formats: ${invalidFiles.join(', ')}. Only CSV files will be processed.`);
    } else {
      setError(null);
    }

    return validFiles;
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setIsLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`${baseUrl}/api/upload-csv`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setClaims(result.files.flatMap(file => file.claims));
        setError(null);
        alert("Files uploaded successfully!");
        navigate("/");
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message);
      }
    } catch (err) {
      setError("An error occurred during upload.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProcessedFiles = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/get-processed-files`);
      const result = await response.json();

      if (response.ok) {
        setProcessedFiles(result.files);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("An error occurred while fetching processed files:", err);
      setError("An error occurred while fetching processed files.");
    }
  };

  useEffect(() => {
    fetchProcessedFiles();
  }, []);

  const clearFiles = () => {
    setFiles([]);
    setClaims([]);
    setProcessedFiles([]);
    setError(null);
  };

  const fileInfoArray = files.map((file) => ({
    name: file.name,
    size: file.size,
  }));

  return (
    <Container className="flex flex-col items-center p-8 bg-[#f9fafb] min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Title order={2} className="text-2xl font-bold text-gray-800">Upload Your Claims CSV</Title>
          <Text size="sm" className="text-gray-600 mt-2">
            Please upload a CSV file containing your claims. Ensure that the file includes the necessary data fields.
          </Text>
        </div>

        <Card shadow="md" padding="lg" radius="md" className="bg-white border border-gray-200 p-6 rounded-lg mb-8">
          <UploadButton onChange={(e: any) => handleFileChange(e)} className="w-full mb-4" />

          {error && (
            <Alert title="Error" color="red" mt="md" className="w-full mt-4 bg-red-50 text-red-700 border-l-4 border-red-400 rounded p-4">
              {error}
            </Alert>
          )}

          {fileInfoArray.length > 0 && <FileAccordion files={fileInfoArray} />}

          {claims.length > 0 && (
            <ScrollArea style={{ height: 300, width: '100%' }} className="mt-4">
              <table className="table-auto w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold border-b">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Provider</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
              </table>
            </ScrollArea>
          )}

          <Group className="flex justify-end mt-6 space-x-4">
            {files.length > 0 && (
              <Button
                color="green"
                onClick={(e) => {
                  e.preventDefault();
                  uploadFiles();
                }}
                disabled={isLoading}
                className={`bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? <Loader size="sm" /> : 'Approve'}
              </Button>
            )}

            {files.length > 0 && (
              <Button color="red" onClick={clearFiles} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
                Remove Claims
              </Button>
            )}
          </Group>
        </Card>

        <div className="flex justify-end mb-4">
          <Button
            color={showProcessedFiles ? "blue" : "gray"}
            variant="outline"
            onClick={() => setShowProcessedFiles(!showProcessedFiles)}
            className="hover:bg-blue-50 transition ease-in-out duration-150 shadow-sm"
          >
            {showProcessedFiles ? 'Hide Processed Files' : 'Show Processed Files'}
          </Button>
        </div>

        {showProcessedFiles && processedFiles.length > 0 && (
          <ProcessedFilesTable files={processedFiles} />
        )}
      </div>
    </Container>
  );
};

export default FileUpload;
