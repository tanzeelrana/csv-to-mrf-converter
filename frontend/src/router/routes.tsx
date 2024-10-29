import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "../layout/BasicLayout";
import FileUpload from "../components/upload-file";
import FileViewer from "../pages/file-viewer"
import HomePage from "../pages/Home";

const router = createBrowserRouter([
  {
    element: <BasicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/upload",
        element: <FileUpload />,
      },
      {
        path: "/mrf/:filename", 
        element: <FileViewer />,
      },
    ],
  },
]);

export default router;
