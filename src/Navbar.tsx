import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { axiosRequest } from "./utils/api";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FilterParam } from "./interfaces/FilterParams";

//Size styling for select component
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

interface NavBarProps {
  filterDogs: (params: FilterParam) => void;
  breeds: string[];
}
const Navbar: React.FC<NavBarProps> = ({ filterDogs, breeds }) => {
  const [filterBreed, setFilterBreed] = useState<string[]>([]);
  const [sortDir, setSortDir] = useState("asc");
  const [sortBy, setSortBy] = useState("breed");
  const navigate = useNavigate();

  //Function used to handle adding and removing breed filter from multiselect component.
  const handleFilter = (event: SelectChangeEvent<typeof filterBreed>) => {
    const {
      target: { value },
    } = event;
    setFilterBreed(typeof value === "string" ? value.split(",") : value);
  };

  //Navbar submits request to sever when the sort direction and sort by values are changed
  useEffect(() => {
    handleSubmit();
  }, [sortDir, sortBy]);

  //Function to change the value of sort direction on click and set to state
  const sortResult = () => {
    if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    }
  };

  //Function used to change the value of sort by value and set to state
  const handleSortType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  //Function called on press of search button. Updates the parameters based on current sort by and sort direction and the breed filter.
  const handleSubmit = async () => {
    const params: FilterParam = { breeds: filterBreed.length > 0 ? filterBreed : null, sort: `${sortBy}:${sortDir}` };
    //Invokes function passed as prop from Home component, passes paramters used to make request to server.
    filterDogs(params);
  };

  //Function called on press of logout button.
  const handleLogout = async () => {
    //Call function to endpoint and navigate to homepage on success.
    axiosRequest.post("/auth/logout", {}, { withCredentials: true });
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <div
                className="m-2"
                role="button"
                onClick={() => {
                  sortResult();
                }}>
                <span className="m-2">{sortDir === "asc" ? "Ascending" : "Descending"}</span>
                {sortDir == "asc" ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
              </div>
            </li>
            <li className="nav-item">
              <div className="m-2">
                <FormControl>
                  <FormLabel id="row-radio-buttons-group-label">Sort By</FormLabel>
                  <RadioGroup row aria-labelledby="row-radio-buttons-group-label" name="row-radio-buttons-group" defaultValue="breed" onChange={handleSortType}>
                    <FormControlLabel value="breed" control={<Radio />} label="Breeds" />
                    <FormControlLabel value="age" control={<Radio />} label="Age" />
                  </RadioGroup>
                </FormControl>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex justify-content-evenly m-2">
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
                <div className="m-2">
                  <Buttons handleButtonClick={handleSubmit} name="Search" />
                </div>
              </div>
            </li>
            <li></li>
          </ul>
          <div className="m-2">
            <Buttons name="Logout" handleButtonClick={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
