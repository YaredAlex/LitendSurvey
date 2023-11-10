import { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { collection, addDoc, getDoc, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import Navigation from "../components/Navigation";

const MakePool = () => {
  const [nQuestion, setNquestion] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [noption, setNoption] = useState(0);
  const [makeOption, setMakeOption] = useState(false);
  const [options, setOptions] = useState({});
  const [qData, setQData] = useState({});
  const [qTitle, setQTitle] = useState({});
  const [qId, setQId] = useState([]);
  useEffect(() => {
    const getD = async () => {
      const querySnapshot = await getDocs(collection(db, "PoolQuestions"));
      let ids = [];
      querySnapshot.forEach((res) => {
        // doc.data() is never undefined for query doc snapshots
        ids.push(res.id);
      });
      setQId(ids);
    };
    getD();
  }, []);
  const sQ = (e) => {
    let n = e.target.value;
    if (n > 0) {
      setShowQuestion(true);
      setNquestion(e.target.value);
    } else {
      showQuestion(false);
    }
  };
  const generateQuestionInput = (n) => {
    const res = [];
    for (let i = 0; i < n; i++)
      res.push(
        <>
          <div
            className="d-flex flex-column "
            style={{
              maxWidth: "500px",
            }}
          >
            <label className="h6 mt-2">**Question {i + 1}</label>
            <input
              className="form-control mt-0"
              type="text"
              name={`tag`}
              placeholder="Your question"
              onChange={(e) => {
                //setQTitle(e.target.value);
                setQTitle({ ...qTitle, [i + 1]: e.target.value });
              }}
            />
          </div>
          <div className="d-flex flex-column gap-2" style={{ maxWidth: 300 }}>
            <label className="h6">Number of Option</label>
            {generateOption(5, i + 1).map((item, index) => (
              <div key={index}>{item}</div>
            ))}
            {/* <div className="d-flex align-items-center gap-3">
              <input
                className="form-control"
                type="number"
                placeholder="0"
                style={{ maxWidth: 100 }}
                max={"5"}
                min={1}
                maxLength={1}
                onChange={(e) => {
                  setNoption(e.target.value);
                  setMakeOption(false);
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => setMakeOption(true)}
              >
                Select
              </button>
            </div> */}
          </div>
        </>
      );

    return res;
  };
  const generateOption = (n, id) => {
    const res = [];
    if (n > 5) {
      swal("To large", "options input", "danger");
      n = 5;
    }
    for (let i = 0; i < n; i++)
      res.push(
        <div
          className="d-flex flex-column gap-2 ms-4"
          style={{
            maxWidth: "500px",
          }}
        >
          <label className="h6 mb-0 mt-1">Option{i + 1}</label>
          <input
            className="form-control"
            type="text"
            name={`option ${i + 1}`}
            placeholder={`option ${i + 1}`}
            onChange={(e) => {
              //setOptions({ ...options, [e.target.name]: e.target.value })
              setOptions({
                ...options,
                [id]: {
                  ...(options[id] || ""),
                  [e.target.name]: e.target.value,
                },
              });
            }}
          />
        </div>
      );
    return res;
  };
  const storeQuestion = async () => {
    let flag = 0;
    let questionData = [];
    for (let i = 1; i <= nQuestion; i++) {
      if (Object.values(options[i]).length < 1) {
        flag = 1;
        swal("Warning", `Question ${i} have less option`, "info");
      }
      questionData.push({
        title: qTitle[i],
        option: Object.values(options[i]),
        id: i,
      });
    }
    console.log(questionData);
    if (flag == 0) {
      save(questionData);
    }
  };
  const save = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "PoolQuestions"), data);
      swal("Saved", "", "success");
      console.log(docRef);
    } catch (e) {
      swal("error", e, "info");
      console.log(e);
    }
  };
  return (
    <>
      <Navigation />
      <div
        className="container mx-auto w-75 mt-4   p-2"
        style={{
          boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
        }}
      >
        <p className="text-center h3 ">Make Pool</p>
        <div>
          <div className="d-flex flex-column gap-2" style={{ maxWidth: 300 }}>
            <label className="h6">Number of Question</label>
            <select className="form-control" onChange={(e) => sQ(e)}>
              <option value={0}>choose Option</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>
          <div className="d-flex flex-wrap justify-content-between">
            {showQuestion &&
              generateQuestionInput(nQuestion).map((item, index) => (
                <div
                  key={index}
                  className="w-100"
                  style={{ maxWidth: "400px" }}
                >
                  {item}
                </div>
              ))}
          </div>
          {/* {makeOption &&
            generateOption(noption).map((item, index) => (
              <div key={index}>{item} </div>
            ))} */}

          {showQuestion && (
            <button
              className="btn btn-secondary mt-2"
              onClick={() => {
                storeQuestion();
              }}
            >
              Submit
            </button>
          )}
          <div>
            <p className="mb-0 mt-3 h6">Check out Pools</p>
            <div className="d-flex flex-column">
              {qId.map((id, index) => (
                <div key={index} className="mb-1">
                  <Link
                    to={`/LitendSurvey/pool-question/${id}`}
                    className="btn btn-outline-secondary"
                  >
                    {`pool ${index + 1}`} {`/pool-question/${id}`}{" "}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakePool;
