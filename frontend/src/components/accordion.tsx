import React, { useState } from 'react';
import { Table, Text, Button, TextInput, ScrollArea } from '@mantine/core';

interface FileInfo {
  name: string;
  size: number;
  id?: string;
}

interface FileTableProps {
  files: FileInfo[];
  onEditFileName?: (index: number, newName: string) => void;
}

const FileTable: React.FC<FileTableProps> = ({ files, onEditFileName }) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleEditClick = (index: number, currentName: string) => {
    setEditIndex(index);
    setNewFileName(currentName);
  };

  const handleSaveClick = async (currentFileName: string, index: number) => {
    // Call the API to update the file name here
    try {
      const response = await fetch(`${baseUrl}/api/update-csv-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: currentFileName,
          newName: newFileName,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error details:", errorMessage);
        throw new Error('Failed to update file name');
      }

      if (onEditFileName) {
        onEditFileName(index, newFileName);
      }
      setEditIndex(null);
    } catch (error) {
      console.error("Failed to update file name:", error);
    }
  };

  return (
    <ScrollArea style={{ height: 300 }}>
      <Table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size (bytes)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file, index) => (
              <tr key={index}>
                <td>
                  {editIndex === index ? (
                    <TextInput
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.currentTarget.value)}
                      placeholder="Enter new file name"
                    />
                  ) : (
                    <Text>{file.name}</Text>
                  )}
                </td>
                <td>{file.size}</td>
                <td>
                  {editIndex === index ? (
                    <Button onClick={() => handleSaveClick(file.name, index)} color="green">Save</Button>
                  ) : (
                    <Button onClick={() => handleEditClick(index, file.name)} color="blue">Edit</Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <Text c="dimmed">No files uploaded.</Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

export default FileTable;
