import React, {useState, useEffect} from 'react'

const Question = ({
    correct_answer, incorrect_answers, question, selectAnswer, id, selected, randomOrder, check
}) => {
    const allOptionsArray = [...incorrect_answers]
    allOptionsArray.splice(randomOrder, 0, correct_answer)

    const allOptions = allOptionsArray.map((option, index) => {
        return (
            <button 
                key={index} 
                className={`btn btn-option 
                            ${option === selected && !check && "btn-option-chosen"} 
                            ${option === correct_answer && check && "btn-option-correct"}
                            ${option !== correct_answer && option === selected && check && "btn-option-incorrect"} `
                }
                onClick={() => selectAnswer(id, option)}
            >
            {option}
            <br />
            </button>
        )
    })

    return (
        <div className='elements'>
            <div className="question-title">
                <h2><strong>{question}</strong></h2>
            </div>
            <div className="options">
                {allOptions}
            </div>
            
            
            <br /><br />
        </div>
    )
}

export default Question