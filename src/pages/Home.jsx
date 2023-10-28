import { useEffect, useState } from "react";
import "../components/card1.css";
import Card1 from "../components/Card1";
import DoughnutBar from "../components/DoughnutBar";
import "../components/home.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
const Home = () => {
  const [qId, setQId] = useState([]);
  const [ansData, setAnsData] = useState([]);
  const [pools, setPools] = useState([]);
  useEffect(() => {
    let ids = [];
    let pools = [];
    const getpools = async () => {
      const querySnapshot = await getDocs(collection(db, "PoolQuestions"));
      querySnapshot.forEach((res) => {
        ids.push(res.id);
        pools.push({
          ...res.data(),
          id: res.id,
        });
      });
      setPools(pools);
      setQId(ids);
      getSubmition();
    };
    getpools();
    const getSubmition = async () => {
      for (let i of ids) {
        const tmp = [];
        const querySnapshot = await getDocs(collection(db, i));
        querySnapshot.forEach((res) => {
          tmp.push(res.data());
        });
        console.log(tmp);
        setAnsData(tmp);
      }
    };
  }, []);
  return (
    <>
      <Navigation />

      <div
        className="container mx-auto mt-4 summary-container p-2"
        style={{
          maxWidth: "900px",
        }}
      >
        <p className="text-center h3 ">SUMMARY</p>
        <div
          className="d-flex justify-content-around rounded mb-4 p-2"
          style={{ backgroundColor: "white" }}
        >
          <Card1 title={"Total Pool"} total={pools.length} />
          <Card1 title={"Total Survey"} total={0} />
        </div>

        <div className="my-2">
          <p className="m-0 border-bottom">Your Question Pools</p>
          <hr className="mt-0" />
          {pools.map((pool, index) => (
            <div
              key={index}
              style={{ backgroundColor: "white", maxWidth: "800px" }}
              className=" p-3 d-flex align-items-center gap-4 mb-4 justify-content-between"
            >
              <div>
                <p className="h6 mb-2">{pool.title}</p>
                {pool.option.map((op, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-3 w-100 justify-content-between  border-bottom"
                    style={{ maxWidth: 500 }}
                  >
                    <p className="m-0"> {op}</p>
                    <p className="h6 m-0 ">{pool[op] || 0}</p>
                  </div>
                ))}
                <div
                  key={index}
                  className="d-flex  align-items-center mb-3 w-100 justify-content-between  border-bottom"
                  style={{ maxWidth: 500 }}
                >
                  <p className="m-0">Total Submition</p>
                  <p className="m-0"> {pool.count}</p>
                </div>
                <div>
                  <p className="mb-0">Link</p>
                  <Link
                    key={index}
                    to={`/LitendSurvey/pool-question/${pool.id}`}
                  >
                    {`/pool-question/${pool.id}`}{" "}
                  </Link>
                </div>
                <hr />
                <Link
                  to={`/LitendSurvey/get-detail/${pool.id}`}
                  className="btn btn-secondary"
                >
                  GetDetail
                </Link>
              </div>
              <div
                style={{
                  maxWidth: 300,
                  backgroundColor: "white",
                }}
                className="p-2 rounded my-2 d-none d-md-block"
              >
                <DoughnutBar
                  data={{
                    labels: Object.values(pool.option),
                    datasets: [
                      {
                        label: pool.title,
                        data: pool.option.map((op) => pool[op] || 0),
                      },
                    ],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
