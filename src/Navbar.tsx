import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { axiosRequest } from "./utils/api";
import { ResInterface } from "./interfaces/Res";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FilterParam } from "./interfaces/FilterParams";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface NavBarParams {
  searchedDogs: (res: ResInterface) => void;
  breeds: string[];
}
const Navbar: React.FC<NavBarParams> = ({ searchedDogs, breeds }) => {
  const [filterBreed, setFilterBreed] = useState<string[]>([]);
  const [sortDir, setSortDir] = useState("asc");
  const [sortBy, setSortBy] = useState("breed");
  const navigate = useNavigate();
  const handleFilter = (event: SelectChangeEvent<typeof filterBreed>) => {
    const {
      target: { value },
    } = event;
    setFilterBreed(typeof value === "string" ? value.split(",") : value);
  };
  const search = async (params: FilterParam) => {
    const res = await axiosRequest.get("/dogs/search", { params, withCredentials: true });
    return res;
  };

  useEffect(() => {
    handleSubmit();
  }, [sortDir, sortBy]);

  const sortResult = () => {
    if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    }
  };
  const handleSortType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };
  const handleSubmit = async () => {
    const params: FilterParam = { breeds: filterBreed.length > 0 ? filterBreed : null, sort: `${sortBy}:${sortDir}` };
    search(params).then((res) => {
      searchedDogs(res.data);
    });
  };

  const handleLogout = async () => {
    axiosRequest.post("/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };
  return (
    <div className="d-flex justify-content-around align-items-center">
      <div
        role="button"
        onClick={() => {
          sortResult();
        }}>
        <span className="m-2">{sortDir === "asc" ? "Ascending" : "Descending"}</span>
        {sortDir == "asc" ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
      </div>
      <FormControl>
        <FormLabel id="row-radio-buttons-group-label">Sort By</FormLabel>
        <RadioGroup row aria-labelledby="row-radio-buttons-group-label" name="row-radio-buttons-group" onChange={handleSortType}>
          <FormControlLabel value="breed" control={<Radio />} label="Breeds" />
          <FormControlLabel value="age" control={<Radio />} label="Age" />
        </RadioGroup>
      </FormControl>
      <div className="d-flex justify-content-evenly ">
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="breed-filter-label">Filter By Breed</InputLabel>
          <Select
            labelId="breed-filter-label"
            id="breed-filter"
            multiple
            value={filterBreed}
            onChange={handleFilter}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}>
            {breeds.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={filterBreed.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Buttons handleButtonClick={handleSubmit} name="Search" />
      </div>
      <div>
        <Buttons name="Logout" handleButtonClick={handleLogout} />
      </div>
    </div>
  );
};

export default Navbar;
