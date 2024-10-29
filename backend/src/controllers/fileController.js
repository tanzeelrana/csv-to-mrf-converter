import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { convertToMRF } from "../utils/convert-to-mrf.js";

let files = [];

export const getProcessedFiles = async (req, res) => {
  try {
    const mrfDir = path.join(process.cwd(), "mrf");
    const files = await fs.readdir(mrfDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      return res.status(404).json({ message: "No processed files found" });
    }

    const fileContents = await Promise.all(jsonFiles.map(async (file) => {
      const filePath = path.join(mrfDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      return { fileName: file, content: JSON.parse(content) };
    }));

    return res.status(200).json({ files: fileContents });
  } catch (err) {
    console.error("An error occurred while retrieving processed files:", err);
    return res.status(500).json({ message: "An error occurred while retrieving processed files", error: err.message });
  }
};

export const getFile = async (req, res) => {
  const { filename } = req.query; 
  const filePath = path.join(process.cwd(), 'mrf', filename);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonRes = JSON.parse(fileContent);
    res.json(jsonRes);
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: 'File not found' });
  }
};

export const uploadCsv = async (req, res) => {
    try {
      const uploadedFiles = req.files;
  
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
  
      const results = await Promise.all(uploadedFiles.map(async (file) => {
        const csvData = file.buffer.toString("utf-8");
  
        const parsedResults = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
  
        if (parsedResults.errors.length > 0) {
          console.warn("Some rows were skipped due to errors:", parsedResults.errors);
        }
  
        const mrfData = convertToMRF(parsedResults.data);
        const mrfDir = path.join(process.cwd(), "mrf");
        const mrfFilePath = path.join(mrfDir, `${file.originalname.replace(".csv", "")}.json`);
  
        await fs.mkdir(mrfDir, { recursive: true });
        await fs.writeFile(mrfFilePath, JSON.stringify(mrfData, null, 2));
  
        files.push({ name: file.originalname.replace(".csv", ""), path: mrfFilePath });
  
        return { fileName: file.originalname, filePath: mrfFilePath };
      }));
  
      return res.status(200).json({
        message: "Files converted and saved successfully",
        files: results,
      });
    } catch (err) {
      console.error("An error occurred:", err);
      return res.status(500).json({ message: "An error occurred during processing", error: err.message });
    }
  };
  

export const updateCsvName = async (req, res) => {
    const { filename, newName } = req.body;
  
    try {
      const fileIndex = files.findIndex(file => file.name === filename.replace(".csv", ""));
  
      if (fileIndex === -1) {
        return res.status(404).json({ message: "File not found" });
      }
  
      const oldFilePath = files[fileIndex].path;
      const newFilePath = path.join(path.dirname(oldFilePath), `${newName}.json`);
  
      await fs.rename(oldFilePath, newFilePath);
  
      files[fileIndex].name = newName; 
      files[fileIndex].path = newFilePath;
  
      return res.json({ success: true, message: "File name updated successfully", updatedFile: files[fileIndex] });
    } catch (error) {
      console.log("Error updating file name:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
};


  