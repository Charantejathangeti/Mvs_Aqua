import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, id, ...props }) => {
  const inputId = id || props.name; // Use name if id is not provided

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-pristine-water text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-deep-sea leading-tight focus:outline-none focus:shadow-outline bg-pristine-water ${
          error ? 'border-red-500' : 'border-pristine-water'
        } ${className || ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default Input;
