import React, {useState, useEffect} from 'react'
import Question from './Question'
import {nanoid} from "nanoid"

const Quizzical = () => {
    //false: starting page. true: game page. 
    const [start, setStart] = useState(false)
    const [allQuestions, setAllQuestions] = useState([])
    const [check, setCheck] = useState(false)
    const [score, serScore] = useState(0)

    //get trivia question data from api
    //api data.results return an array of n questions. each question is an object.
    useEffect(() => {
        if (start === true) {
            fetch("https://opentdb.com/api.php?amount=5&difficulty=easy")
                .then(response => response.json())
                .then(data => setAllQuestions(data.results.map(item => 
                    ({
                        ...item,
                        question: item.question.replace(/(&quot\;)/g,"\"").replace(/(&#039\;)/g, "\'"),
                        id: nanoid(),
                        selected: "",
                        randomOrder: Math.floor(Math.random() * (item.incorrect_answers.length + 1))
                    })
                )))
            setCheck(false)
            serScore(0)
        //clear all the questions when return to the starting page, so we won't see the previous question set when we restart a new game
        } else {
            setAllQuestions([])
        }
    }, [start])


    
    //update the selected answer in the correct question object
    function selectAnswer(id, selectedOption) {
        //only when answer is not checked, users are allowed to select answers. 
        if (!check) 
            setAllQuestions(oldQuestions => oldQuestions.map(question => {
                return question.id === id ? 
                    {...question, selected: selectedOption} :
                    question
            }))
    }

    let allAnswered = allQuestions.every(question => question.selected)
    function checkAnswer() {
        //user can only check answer when all quetion is answered
        if (allAnswered) {
            setCheck(true)
            //count score
            allQuestions.forEach(question => {
                if (question.selected === question.correct_answer) {
                    serScore(oldScore => oldScore + 1)
                }
            })
        }
    }

    function playAgain() {
        setStart(false)
    }
    

    const questionElements = allQuestions.map((item, index) => 
        <Question
            key={item.id}
            correct_answer={item.correct_answer}
            incorrect_answers={item.incorrect_answers}
            question={item.question}
            id={item.id}
            selectAnswer={selectAnswer}
            selected={item.selected}
            randomOrder={item.randomOrder}
            check={check}
         />
    )

    
    return (
        <main>
            <div className="starting-page" style={start ? {display: "none"} : null}>
                <h1>Quizzicalz</h1>
                <p>Powered by <a className='api-link' href="https://opentdb.com/" target="_blank">OPEN TRIVIA DATABASE</a></p>
                <button className='btn-start' onClick={() => setStart(true)}>start</button>
                
            </div>
            <div className="game-page" style={!start ? {display: "none"} : null}>
                {/* <div>{questionElements}</div> */}
                {questionElements}
                <div className="loading">
                    <h2 style={start && allQuestions.length === 0 ? null : {display: "none"}} >Loading ... </h2>
                </div>
                <button 
                    className="btn-check-answer" 
                    onClick={checkAnswer}
                    style={check ? {display: "none"} : null}
                >check-answer</button>
                <div className="result"
                    style={!check ? {display: "none"} : null}
                >
                    <h2
                        //  style={!start ? {display: "none"} : null} 
                    >
                    <strong>
                        You scored {score}/5 correct answers! 
                    </strong></h2>
                    <button 
                        className="btn-play-again" 
                        onClick={playAgain}
                        // style={!start ? {display: "none"} : null} 
                    >
                    Play again
                    </button>
                </div>
                <footer>©John CY Liao</footer>
            </div>
            

            
        </main>
    )
}

export default Quizzical