import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Dog } from "./interfaces/Dog";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface PetProps {
  dog: Dog;
  fav: boolean;
  handleFav: (id: string) => void;
}
const Pet: React.FC<PetProps> = ({ dog, fav, handleFav }) => {
  const handleFavClick = () => {
    handleFav(dog.id);
  };
  return (
    <Card className="m-2 p-2">
      <CardMedia sx={{ height: 140 }} image={dog.img} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {dog.name}
        </Typography>
        <div className="d-flex justify-content-between">
          <Typography variant="body2" color="text.primary">
            {dog.breed}
          </Typography>
        </div>
        <div className="d-flex justify-content-between">
          <Typography variant="body2" color="text.primary">
            {dog.age} years
          </Typography>
        </div>
        <div className="d-flex justify-content-between">
          <Typography variant="body2" color="text.primary">
            Zipcode {dog.zip_code}
          </Typography>
        </div>
      </CardContent>
      <CardActions onClick={handleFavClick} role="button">
        {fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </CardActions>
    </Card>
  );
};

export default Pet;
