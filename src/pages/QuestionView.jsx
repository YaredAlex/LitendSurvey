import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
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
  const [question, setQuestion] = useState([]);
  const [ans, setAns] = useState({});
  const [submited, setSubmited] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(qId.toString())) {
      swal("Respose already submited!", "", "info");
    }

    const getQuestion = async () => {
      setLoading(true);
      const docRef = doc(db, "PoolQuestions", qId);
      const result = await getDoc(docRef);
      console.log(result.data());
      if (result.exists) {
        setTitle(result.data().title);
        setOption(result.data().option);
        setQuestion(result.data().quesiton);
      } else {
        console.log(result);
      }
      setLoading(false);
    };
    getQuestion();
    //Getting users location for servery purpose
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
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
    console.log(ans);
    try {
      const docRef = await addDoc(collection(db, qId), { ...ans });
      const upDoc = doc(db, "PoolQuestions", qId);

      // Update the timestamp field with the value from the server
      const update = await updateDoc(upDoc, {
        count: increment(1),
        // [ans.answer]: increment(1),
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
            className="d-flex justify-content-center align-items-center"
            style={{
              position: "absolute",
              top: "0",
              height: "100vh",
              width: "100%",
              backgroundColor: "rgb(0,0,0,0.4)",
              zIndex: 3,
            }}
          >
            <p className="h5 bg-white p-3">Loading...</p>
          </div>
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
            {question &&
              question.map((item, key) => (
                <div key={key} className="mt-2">
                  <p className="h4 mb-0">
                    {item.title}
                    {"?"}
                  </p>
                  <hr className="mt-0 mb-3" />
                  <div>
                    {item.option.map((option, index) => (
                      <div key={index} className="d-flex  gap-3">
                        <input
                          type="radio"
                          id={`${option + key}`}
                          name={item.title}
                          value={option}
                          onChange={(e) =>
                            setAns({ ...ans, [item.title]: e.target.value })
                          }
                        />
                        <label
                          className="question-label"
                          htmlFor={option + key}
                        >
                          {option}{" "}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

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
