"use client";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your answer...",
  disabled = false,
}: TextInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-900/50 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-lg text-gray-200 placeholder-gray-500 disabled:bg-gray-800 disabled:cursor-not-allowed transition-all duration-200"
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 transform hover:scale-105 active:scale-95 disabled:from-gray-700 disabled:to-gray-700 disabled:border-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
      >
        Submit
      </button>
    </div>
  );
}

