# CSV to MRF Converter

## Overview

This project is a CSV to MRF (Medical Record Format) converter that allows users to upload CSV files containing claims data. The application processes the uploaded CSV files and converts them into a structured JSON format, which can be easily used for further analysis or storage.

## Technologies Used

- **Frontend**: React, Tailwind CSS, Mantine
- **Backend**: Node.js, Express, Multer, PapaParse
- **Others**: dotenv for environment variable management

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v20 or higher)
- npm (Node Package Manager)

### Project Structure

```plaintext
csv-to-mrf-converter/
├── README.md          # Main README for the project
├── backend/
│   ├── .env           # Backend environment variables
│   ├── .env.example   # Example env file for backend
│   ├── package.json   # Backend dependencies
│   └── ...
├── frontend/
│   ├── .env           # Frontend environment variables
│   ├── .env.example   # Example env file for frontend
│   ├── package.json   # Frontend dependencies
│   └── ...
└── ...
