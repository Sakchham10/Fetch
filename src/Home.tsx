import { Pagination } from "@mui/material";
import "./Home.css";
import { useEffect, useState } from "react";
import { axiosRequest } from "./utils/api";
import { Dog } from "./interfaces/Dog";
import Pet from "./Pet";
import { ResInterface } from "./interfaces/Res";
import Buttons from "./Buttons";
import Navbar from "./Navbar";

const Home = () => {
  const [dogs, setDogs] = useState<Dog[]>();
  const [total, setTotal] = useState(0);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [favDogs, setFavDogs] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [resData, setResData] = useState<ResInterface>();
  const [params, setParams] = useState<FilterParam>({ sort: `breed:asc`, breeds: null });
  const getDogs = async (dogIds: String) => {
    const dogData = await axiosRequest.post("/dogs", dogIds, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    setDogs(dogData.data);
  };
  useEffect(() => {
    const getInitial = async () => {
      const breeds = (await axiosRequest.get("/dogs/breeds", { withCredentials: true })).data;
      setBreeds(breeds);
    };
    getInitial();
    getData();
  }, []);
  const getData = async () => {
    const res: ResInterface = (await axiosRequest.get("/dogs/search", { params, withCredentials: true })).data;
    setResData(res);
    setTotal(res.total);
    const dogIds = JSON.stringify(res.resultIds);
    getDogs(dogIds);
    const dogData = await axiosRequest.post("/dogs", dogIds, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    setDogs(dogData.data);
  };
  useEffect(() => {
    getData();
  }, [params]);

  const getSearched = (res: ResInterface) => {
    setResData(res);
    setTotal(res.total);
    getDogs(JSON.stringify(res.resultIds));
  };

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(params);
    setParams((prev) => {
      return { ...prev, start: 25 * value };
    });
    setPage(value);
  };

  const addFav = (id: string) => {
    setFavDogs((prevState) => {
      if (prevState.includes(id)) {
        prevState = prevState.filter(function (item) {
          return item !== id;
        });
      } else {
        return [...prevState, id];
      }
      return prevState;
    });
  };
  const handleAdopt = async () => {
    const res = await axiosRequest.post("/dogs/match", favDogs, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const adoptFavId = [res.data.match];
    getDogs(JSON.stringify(adoptFavId));
  };
  return (
    <div className="bg">
      <Navbar searchedDogs={getSearched} breeds={breeds} />
      <div className="d-flex justify-content-center align-items-between" onClick={handleAdopt}>
        {favDogs.length > 0 ? <Buttons name="Adopt" /> : ""}
      </div>
      <div className="d-flex flex-wrap m-2 p-2">
        {dogs?.map((dog) => (
          <Pet dog={dog} key={dog.id} fav={favDogs.includes(dog.id)} handleFav={addFav} />
        ))}
      </div>
      {total > 25 ? <Pagination count={Math.floor(total / 25)} page={page} variant="outlined" color="primary" onChange={handlePaginationChange} /> : ""}
    </div>
  );
};

export default Home;
