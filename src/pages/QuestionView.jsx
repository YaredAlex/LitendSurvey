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
import ReactLoading from "react-loading";
const QuestionView = () => {
  const maxQuestion = 5;
  const { qId } = useParams();
  const [options, setOption] = useState([]);
  const [allQuestion, setAllQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState([]);
  const [ans, setAns] = useState({});
  const [submited, setSubmited] = useState(false);
  const [page, setPage] = useState(1);
  const [pagenum, setpageNum] = useState(0);
  useEffect(() => {
    if (localStorage.getItem(qId.toString())) {
      swal("Respose already submited!", "", "info");
    }
    const getQuestion = async () => {
      setLoading(true);
      const docRef = doc(db, "PoolQuestions", qId);
      const result = await getDoc(docRef);
      let que;
      if (result.exists) {
        que = result.data().question;
        setAllQuestion(result.data().question);
        divideQuestion(que);
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
  const divideQuestion = (que) => {
    let numPage = que.length / maxQuestion;
    setQuestion(que);
    // if (numPage > 0) {
    //   setQuestion(que.slice(0, maxQuestion));
    //   setpageNum(numPage);
    // } else {
    //   setQuestion(que);
    // }
  };
  const gotoNextPage = () => {
    let questionStart = page * maxQuestion;
    let questionEnd = questionStart + maxQuestion;
    setQuestion(allQuestion.slice(questionStart, questionEnd));
    setPage(page + 1);
    setpageNum(pagenum - 1);
  };
  const sendAns = () => {
    let flag = 0;
    question.forEach((que) => {
      if (!ans[que.title]) {
        flag = 1;
      }
    });
    if (flag == 1) swal("please select all", "", "info");
    else save(ans);
  };
  const save = async (ans) => {
    try {
      const docRef = await addDoc(collection(db, qId), { ...ans });
      const upDoc = doc(db, "PoolQuestions", qId);

      // Update the timestamp field with the value from the server
      let inc = {};
      question.forEach((que) => {
        inc = { ...inc, [ans[que.title] + que.id]: increment(1) };
      });
      const update = await updateDoc(upDoc, {
        count: increment(1),
        ...inc,
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
      <div className="">
        <div
          className="question-container "
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        ></div>
        {loading && (
          <div
            className="d-flex justify-content-center align-items-center "
            style={{
              position: "absolute",
              top: "0",
              height: "100vh",
              width: "100%",
              backgroundColor: "rgb(0,0,0,0.4)",
              zIndex: 200,
            }}
          >
            <div className="h5 bg-white p-3 rounded d-flex align-items-center flex-column ">
              <ReactLoading
                type={"spin"}
                color="black"
                height={50}
                width={50}
              />
              <p className="mt-2">Loading..</p>
            </div>
          </div>
        )}

        {!submited && (
          <div
            className=" d-flex mx-auto justify-content-center pt-3 align-items-center"
            style={{
              maxWidth: "500px",
              minHeight: "100vh",
              zIndex: 100,
              position: "relative",
            }}
          >
            <div
              className="border border-primary rounded question-card"
              style={{ width: "100%" }}
            >
              <p className="h4 text-center " style={{ color: "#7952b3" }}>
                LITEND
              </p>
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
                      {key + 1 + ". "}
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
              {pagenum > 1 ? (
                <button
                  className="btn w-100  mt-3 mx-auto"
                  style={{
                    maxWidth: "300px",
                    fontWeight: "bold",
                    display: "block",
                    backgroundColor: "#7952b3",
                    color: "white",
                    fontSize: "18px",
                  }}
                  onClick={() => gotoNextPage()}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn w-100  mt-3 mx-auto"
                  style={{
                    maxWidth: "300px",
                    fontWeight: "bold",
                    display: "block",
                    backgroundColor: "#7952b3",
                    color: "white",
                    fontSize: "18px",
                  }}
                  onClick={() => sendAns()}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {submited && (
          <div
            className="d-flex  align-items-center justify-content-center"
            style={{ zIndex: 50, position: "relative", height: "100vh" }}
          >
            <div className="border border-primary question-card rounded ">
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
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionView;
