import React, { useState, useRef, useEffect } from "react";
import "../css/quiz.css";
import { data } from "../data";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const option_array = [option1, option2, option3, option4];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setResult(true);
    }
  }, [timeLeft]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setLock(true);
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        setLock(true);
        option_array[question.ans - 1].current.classList.add("correct");
      }
    }
  };

  const next = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      setIndex((prevIndex) => prevIndex + 1);
      setQuestion(data[index + 1]);
      setLock(false);
      option_array.forEach((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("correct");
      });
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    setTimeLeft(900); // Reset timer to 15 minutes
  };

  // Convert remaining time to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <div className="instructions">
        <p className="centered emphasized">
          Please read the questions carefully before selecting your answer. Once
          selected, your answer cannot be changed.
        </p>
      </div>
      <div className="timer-container">
        Time Left: {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <div className="container">
        {/* <h1>Quiz App</h1> */}
        {result ? (
          <>
            <h2>
              You Scored {score} out of {data.length}
            </h2>
            <button onClick={reset}>Reset</button>
          </>
        ) : (
          <>
            <h2>
              {index + 1}. {question.question}
            </h2>
            <ul>
              <li ref={option1} onClick={(e) => checkAns(e, 1)}>
                {question.option1}
              </li>
              <li ref={option2} onClick={(e) => checkAns(e, 2)}>
                {question.option2}
              </li>
              <li ref={option3} onClick={(e) => checkAns(e, 3)}>
                {question.option3}
              </li>
              <li ref={option4} onClick={(e) => checkAns(e, 4)}>
                {question.option4}
              </li>
            </ul>
            <button onClick={next}>Next</button>
            <div className="index">
              {index + 1} of {data.length} questions
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Quiz;
