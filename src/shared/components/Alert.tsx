import React from "react";

type AlertProps = {
  type: "success" | "error"; 
  message: string; 
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
};

const Alert: React.FC<AlertProps> = ({ 
  type, 
  message, 
  onConfirm,
  onCancel,
  confirmText = "OK Done!",
  cancelText = "Cancel",
  showCancelButton = false
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          {type === "success" ? (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-2">
            {type === "success" ? "Success!" : "Confirmation"}
          </h2>
          
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          <div className="flex w-full gap-3">
            {showCancelButton && onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 py-2 px-4 rounded font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`flex-1 py-2 px-4 rounded font-medium ${
                type === "success" 
                  ? "bg-[#fca311] text-white hover:bg-[#e69200]" 
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;