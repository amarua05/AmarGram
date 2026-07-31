import { useCallback, useState } from "react";
import { Camera } from "lucide-react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl?: string;
  compact?: boolean;
};

const FileUploader = ({
  fieldChange,
  mediaUrl,
  compact = false,
}: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string | undefined>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  if (compact) {
    return (
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} className="hidden" />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-9 w-9 rounded-full border border-dark-4 bg-dark-2 text-light-1 shadow-sm hover:bg-dark-3">
          {fileUrl ? (
            <img
              src={fileUrl}
              alt="uploaded preview"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" className="shad-button_dark_4">
            Select from device
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;