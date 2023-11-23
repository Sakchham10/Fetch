import Button from "@mui/material/Button";
interface buttonsProps {
  name: string;
  handleButtonClick?: () => void;
}
const Buttons: React.FC<buttonsProps> = ({ name, handleButtonClick }) => {
  const handleClick = () => {
    if (handleButtonClick) {
      handleButtonClick();
    }
  };
  return (
    <Button variant="contained" className="m-2" onClick={handleClick}>
      {name}
    </Button>
  );
};

export default Buttons;
