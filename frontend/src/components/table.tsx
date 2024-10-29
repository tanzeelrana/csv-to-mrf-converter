import React from 'react';
import { Table, ScrollArea, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

const ProcessedFilesTable = ({ files }) => {
  if (!files || files.length === 0) {
    return <Text>No processed files to display.</Text>;
  }

  return (
    <ScrollArea style={{ height: 300 }}>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Files Name</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.fileName}>
              <td>
                <Link to={`/mrf/${file.fileName}`} target="_blank">
                  {file.fileName}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

export default ProcessedFilesTable;
