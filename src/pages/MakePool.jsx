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
  const [qTitle, setQTitle] = useState("");
  const [qId, setQId] = useState([]);
  useEffect(() => {
    const getD = async () => {
      const querySnapshot = await getDocs(collection(db, "PoolQuestions"));
      let ids = [];
      querySnapshot.forEach((res) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(res.id);
        ids.push(res.id);
      });
      console.log(ids, "ids");
      setQId(ids);
    };
    getD();
  }, []);
  const sQ = (e) => {
    let n = e.target.value;
    if (n > 0) {
      setShowQuestion(true);
    } else showQuestion(false);
    setNquestion(e.target.value);
  };
  const SS = (n) => {
    const res = [];
    for (let i = 0; i < n; i++)
      res.push(
        <>
          <div
            className="d-flex flex-column gap-2"
            style={{
              maxWidth: "500px",
            }}
          >
            <label className="h6">Question {i + 1}</label>
            <input
              className="form-control"
              type="text"
              name={`tag`}
              placeholder="Your question"
              onChange={(e) => {
                setQTitle(e.target.value);
              }}
            />
          </div>
          <div className="d-flex flex-column gap-2" style={{ maxWidth: 300 }}>
            <label className="h6">Number of Option</label>

            <div className="d-flex align-items-center gap-3">
              <input
                className="form-control"
                type="number"
                placeholder="2"
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
            </div>
          </div>
        </>
      );

    return res;
  };
  const MO = (n) => {
    const res = [];
    if (n > 5) {
      alert("To big Options");
      n = 5;
    }
    for (let i = 0; i < n; i++)
      res.push(
        <div
          className="d-flex flex-column gap-2"
          style={{
            maxWidth: "500px",
          }}
        >
          <label className="h6">Question {i + 1}</label>
          <input
            className="form-control"
            type="text"
            name={`option ${i + 1}`}
            placeholder={`option ${i + 1}`}
            onChange={(e) =>
              setOptions({ ...options, [e.target.name]: e.target.value })
            }
          />
        </div>
      );
    return res;
  };
  const storeQuestion = async () => {
    let data = {
      title: qTitle,
      option: Object.values(options),
    };
    save(data);
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
      <div className="container mx-auto w-75 mt-4 border border-secondary  p-2">
        <p className="text-center h3 ">Make Pool</p>
        <div>
          <div className="d-flex flex-column gap-2" style={{ maxWidth: 300 }}>
            <label className="h6">Number of Question</label>
            <select className="form-control" onChange={(e) => sQ(e)}>
              <option value={0}>choose Option</option>
              <option value={1}>1</option>
            </select>
          </div>
          {showQuestion &&
            SS(nQuestion).map((item, index) => <div key={index}>{item}</div>)}
          {makeOption &&
            MO(noption).map((item, index) => <div key={index}>{item} </div>)}

          {showQuestion && makeOption && (
            <button
              className="btn btn-secondary mt-5"
              onClick={() => {
                storeQuestion();
              }}
            >
              Submit
            </button>
          )}
          <div>
            <p>You Pools</p>
            <div className="d-flex flex-column">
              {qId.map((id, index) => (
                <Link key={index} to={`/pool-question/${id}`}>
                  {`pool ${index + 1}`} {`/pool-question/${id}`}{" "}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakePool;
