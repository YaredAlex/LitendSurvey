import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase.config";
import Navigation from "../components/Navigation";
import * as Papa from "papaparse";
import "./poolDetail.css";
import BarChart from "../components/BarChar";
const PoolDetail = () => {
  const { id } = useParams();
  const [pool, setPool] = useState([]);
  const [ansData, setAnsData] = useState([]);
  const [tableTitle, setTableTitle] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let ans = [];
    const getsubmitions = async () => {
      const querySnapshot = await getDocs(collection(db, id));
      querySnapshot.forEach((res) => {
        ans.push({
          ...res.data(),
        });
      });
      let tt = Object.keys(ans[0]);
      setTableTitle(tt);
      console.log(ans);
      setAnsData([...ans]);
    };
    getsubmitions();
    //
    const getpool = async () => {
      setLoading(true);
      const pool = [];
      const docRef = doc(db, "PoolQuestions", id);
      const result = await getDoc(docRef);

      if (result.exists) {
        pool.push({
          ...result.data(),
          id: result.id,
        });
      } else {
        console.log(result);
      }
      console.log(pool);
      setPool(pool);
      setLoading(false);
    };
    getpool();
    return setAnsData([]);
  }, []);
  const exportToCsv = () => {
    const csv = Papa.unparse(ansData);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", `${id}.csv`);
    document.body.appendChild(link);
    link.click();
  };
  return (
    <>
      <Navigation />
      <div className="container">
        <button className="btn btn-primary my-2" onClick={() => exportToCsv()}>
          GetCSV
        </button>
        <div className="d-flex gap-2 flex-wrap w-100 justify-content-around">
          {!loading &&
            pool.map((item, key) =>
              item.question.map((que, index) => (
                <div
                  key={index}
                  className="w-100"
                  style={{
                    maxWidth: "500px",
                    Height: "900px",
                  }}
                >
                  <BarChart
                    data={{
                      labels: Object.values(que.option),
                      datasets: [
                        {
                          label: que.title,
                          data: que.option.map((op) => item[op + que.id] || 0),
                        },
                      ],
                    }}
                  />
                </div>
              ))
            )}
        </div>
        <div
          style={{
            overflowX: "scroll",
          }}
        >
          <table className="table">
            <thead>
              <tr>
                {tableTitle.map((title, key) => (
                  <th key={key}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ansData.map((ans, index) => (
                <tr key={index}>
                  {tableTitle.map((title, key) => (
                    <td key={key}>{ans[title] || "Not given"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PoolDetail;
