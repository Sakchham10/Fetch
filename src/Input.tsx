import { TextField } from "@mui/material";

interface inputProps {
  inputError?: boolean;
  inputType: string;
  name: string;
  changeValue: (newName: string) => void;
  id: string;
}

const Input: React.FC<inputProps> = ({ inputError, inputType, name, changeValue, id }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeValue(e.currentTarget.value);
  };
  return <TextField id={id} label={name} variant="outlined" type={inputType} className="m-2" error={inputError} onChange={handleChange} />;
};

export default Input;
