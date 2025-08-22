export default function Input({ label, type = "text", value, onChange }) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  }
  