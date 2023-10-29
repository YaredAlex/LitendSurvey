import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase.config";
import "./question.css";
import swal from "sweetalert";
import log from "../assets/log_img.jpeg";
const QuestionView = () => {
  const { qId } = useParams();
  const [options, setOption] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [ans, setAns] = useState({});
  const [submited, setSubmited] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(qId.toString())) {
      swal("Respose already sumbimted!", "", "info");
    }

    const getD = async () => {
      setLoading(true);
      const docRef = doc(db, "PoolQuestions", qId);
      const result = await getDoc(docRef);
      if (result.exists) {
        setTitle(result.data().title);
        setOption(result.data().option);
      } else {
        console.log(result);
      }
      setLoading(false);
    };
    getD();
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        // Access the country from the response
        const country = data.country_name;
        console.log("User's country:", country);
        setAns({
          ...ans,
          city: data.city,
          country: data.country_name,
          ip: data.ip,
          timeZone: data.timezone,
          time: new Date().toString(),
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const sendAns = () => {
    if (ans == "") {
      swal("please select one", "", "info");
    } else {
      save(ans);
    }
  };
  const save = async (ans) => {
    try {
      const docRef = await addDoc(collection(db, qId), { ...ans });
      const upDoc = doc(db, "PoolQuestions", qId);

      // Update the timestamp field with the value from the server
      const update = await updateDoc(upDoc, {
        count: increment(1),
        result: {
          [ans.answer]: increment(1),
        },
        [ans.answer]: increment(1),
      });
      swal("Great!", "", "success");
      setSubmited(true);
      localStorage.setItem(qId.toString(), "submited");
    } catch (e) {
      swal("error", e, "info");
      console.log(e);
    }
  };
  return (
    <>
      <div className="question-container d-flex justify-content-center align-items-center">
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "0",
              height: "100vh",
              width: "100%",
              backgroundColor: "rgb(0,0,0,0.4)",
              zIndex: 3,
            }}
          ></div>
        )}
        {!submited && (
          <div className="border border-primary question-card">
            <p className="h6 text-center text-primary">LITEND</p>
            <div className="mb-2">
              <img
                src={log}
                alt="image"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div>
              <p className="h4 mb-0">
                {title}
                {"?"}
              </p>
              <hr className="mt-0 mb-3" />
              <div>
                {options.map((option, index) => (
                  <div key={index} className="d-flex  gap-3">
                    <input
                      type="radio"
                      id={option}
                      name={title}
                      value={option}
                      onChange={(e) =>
                        setAns({ ...ans, answer: e.target.value })
                      }
                    />
                    <label className="question-label" htmlFor={option}>
                      {option}{" "}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary mt-3 mx-auto"
              style={{
                display: "block",
                maxWidth: "200px",
                width: "100%",
              }}
              onClick={() => sendAns()}
            >
              submit
            </button>
          </div>
        )}
        {submited && (
          <div className="border border-primary question-card">
            <p className="h6 text-center text-primary">LITEND</p>
            <div className="mb-2">
              <img
                src={log}
                alt="image"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            </div>
            <p className="h5 text-center">Thank you!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionView;
