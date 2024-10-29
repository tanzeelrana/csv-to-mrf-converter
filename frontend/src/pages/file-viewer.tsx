import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text, Loader } from '@mantine/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'tailwindcss/tailwind.css';

const FileViewer = () => {
  const { filename } = useParams();
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    const fetchFileContent = async () => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      try {
        const response = await fetch(`${baseUrl}/api/files?filename=${filename}`);
  
        if (response.ok) {
          const result = await response.json();
          setFileContent(result);

          if (result.claims.length > 0) {
            const claims = result.claims;
            setRowData(claims);

            const keys = Object.keys(claims[0]);
            const dynamicColumnDefs = keys.map(key => ({
              headerName: key,
              field: key,
            }));
            setColumnDefs(dynamicColumnDefs);
          } else {
            setError('No claims data found.');
          }
        } else {
          const errorResult = await response.json();
          setError(errorResult.message);
        }
      } catch (err) {
        console.log("error", err);
        setError("An error occurred while fetching the file content.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFileContent();
  }, [filename]);
  
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Container className="p-8 max-w-5xl mx-auto bg-black rounded-md shadow-lg mt-10">
      <Title order={2} className="text-3xl font-semibold text-center text-white mb-6">
        {filename}
      </Title>

      {rowData.length > 0 ? (
        <div className="ag-theme-alpine-dark" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={50}
          />
        </div>
      ) : (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mt-4 border border-gray-700">
          <pre className="text-gray-300 font-mono text-sm overflow-x-auto bg-gray-800 p-4 rounded-md">
            {JSON.stringify(fileContent, null, 2)}
          </pre>
        </div>
      )}
    </Container>
  );
};

export default FileViewer;
