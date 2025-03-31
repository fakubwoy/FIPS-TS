import { Button } from 'react-bootstrap';
import { ChangeEvent } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="file-uploader mb-4">
      <input
        type="file"
        id="excel-upload"
        accept=".xlsx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button as="label" htmlFor="excel-upload" variant="primary">
        Upload Excel File
      </Button>
      <small className="ms-2 text-muted">(.xlsx files only)</small>
    </div>
  );
};

export default FileUploader;