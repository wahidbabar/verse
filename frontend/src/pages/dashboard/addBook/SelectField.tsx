import {
  CreateBookRequest,
  UpdateBookRequest,
} from "@/redux/features/books/booksApi";

interface SelectOption {
  value: string;
  label: string;
}

// Reusable Select Component with Type Safety
interface SelectFieldProps {
  label: string;
  name: keyof CreateBookRequest | keyof UpdateBookRequest;
  options: SelectOption[];
  register: any;
  errors: any;
  validation?: any;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
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
      <select
        id={name}
        {...register(name, validation)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
          ${
            errors[name]
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-300"
          }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default SelectField;
