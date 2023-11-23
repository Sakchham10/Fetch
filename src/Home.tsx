import { Pagination } from "@mui/material";
import "./Home.css";
import { useEffect, useState } from "react";
import { axiosRequest } from "./utils/api";
import { Dog } from "./interfaces/Dog";
import Pet from "./Pet";
import { ResInterface } from "./interfaces/Res";
import Buttons from "./Buttons";
import Navbar from "./Navbar";
import { FilterParam } from "./interfaces/FilterParams";

const Home = () => {
  const [dogs, setDogs] = useState<Dog[]>();
  const [total, setTotal] = useState(0);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [favDogs, setFavDogs] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // The default sort is by breed in ascending state. No breeds are filtered intially.
  const [params, setParams] = useState<FilterParam>({ sort: `breed:asc`, breeds: null });

  const getDogs = async (dogIds: String) => {
    const dogData = await axiosRequest.post("/dogs", dogIds, {
      headers: {
        "Content-Type": "application/json",
      },
      // Ensure that cookie is sent with every request
      withCredentials: true,
    });
    //Save the data of the dogs from the response to state.
    setDogs(dogData.data);
  };

  //Required to populate the multi select filter for breed.
  useEffect(() => {
    const getInitial = async () => {
      const breeds = (await axiosRequest.get("/dogs/breeds", { withCredentials: true })).data;
      //Save the list of dog breeds to the state, which is sent to the Navbar as props later.
      setBreeds(breeds);
    };
    //Call the async function on initial render
    getInitial();
  }, []);

  const getData = async () => {
    const res: ResInterface = (await axiosRequest.get("/dogs/search", { params, withCredentials: true })).data;
    //Saving the total number of dogs in each request to state. Used by pagination to determine the number of pages later.
    setTotal(res.total);
    const dogIds = JSON.stringify(res.resultIds);
    //Saving the ids of dogs to the state. Invoke getdogs to get the data of the dogs based on the dogId
    getDogs(dogIds);
  };
  useEffect(() => {
    //Get first 25 dogs, and call server with every time query param changes
    getData();
  }, [params]);

  const getSearched = (params: FilterParam) => {
    setParams(params);
  };

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    //Set new page to value received from event
    setPage(value);
    const fromVal = 25 * (value - 1);
    if (value == 1) {
      setParams((prev) => {
        return { ...prev, from: 1 };
      });
    }
    setParams((prev) => {
      //Update params to include new from value in query
      return { ...prev, from: fromVal };
    });
  };

  const addFav = (id: string) => {
    setFavDogs((prevState) => {
      //If the favDog array already includes the id, remove it from the array
      if (prevState.includes(id)) {
        prevState = prevState.filter(function (item) {
          return item !== id;
        });
      } else {
        //If the favDog array doesn't include the id, add it to the array
        return [...prevState, id];
      }
      return prevState;
    });
  };
  const handleAdopt = async () => {
    //Call the server with the list of favDog array
    const res = await axiosRequest.post("/dogs/match", favDogs, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    //Set total to 0 to remove pagination
    setTotal(0);
    //Save the favDog id from the response to an array and call the getDogs function to get the data from the server to display it.
    const adoptFavId = [res.data.match];
    getDogs(JSON.stringify(adoptFavId));
    //Clear list of favdogs after sending request to the server.
    setFavDogs([]);
  };
  return (
    <div className="bg">
      <Navbar filterDogs={getSearched} breeds={breeds} />
      <div className="d-flex justify-content-center align-items-between" onClick={handleAdopt}>
        {favDogs.length > 0 ? <Buttons name="Adopt" /> : ""}
      </div>
      <div className="d-flex flex-wrap m-2 p-2">
        {dogs?.map((dog) => (
          <Pet dog={dog} key={dog.id} fav={favDogs.includes(dog.id)} handleFav={addFav} />
        ))}
      </div>
      <div className="d-flex justify-content-center">{total > 25 ? <Pagination count={Math.ceil(total / 25)} page={page} color="primary" onChange={handlePaginationChange} /> : ""}</div>
    </div>
  );
};

export default Home;
