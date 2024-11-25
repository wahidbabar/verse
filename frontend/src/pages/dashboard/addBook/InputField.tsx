import {
  CreateBookRequest,
  UpdateBookRequest,
} from "@/redux/features/books/booksApi";

interface InputFieldProps {
  label: string;
  name: keyof CreateBookRequest | keyof UpdateBookRequest;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
  register: any;
  errors: any;
  validation?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  validation = {},
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          {...register(name, validation)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
            ${
              errors[name]
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={name}
          {...register(name, validation)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
            ${
              errors[name]
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default InputField;
