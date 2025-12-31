import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search..." }: SearchBarProps) => {
  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      className="search-input min-w-[80%] max-w-[30%] mb-4"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
