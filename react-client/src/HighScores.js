import React, { useState, useEffect } from 'react';



function HighScores({score}) {
    //initializing 2 state vars: 1)highScores to store the fetched high scores list. 2)the message to display.
    const [highScores, setHighScores] = useState([]);
    const [message, setMessage] = useState("");

    //the following func is an asynchronous func that fetches the high score data from the server and returns a JS object.
    const loadHighScores = async () => {
        const response = await fetch('/java_react_war/api/highscores');
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    };



    //the following hook useEffect will fetch high scores data using the loadHighScores func to update highScore state.
    useEffect(() => {
        const fetchHighScores = async () => {
            try {
                const newHighScores = await loadHighScores();
                setHighScores(newHighScores);
                setMessage("");
            } catch (error) {
                setMessage("An error occurred fetching high scores table");
            }
        };

        fetchHighScores();
    }, [score]);


    //this return renders the high scores list as a table, showing rank, name and score of the user, and message.
    return (
        <div className="high-scores">
            <h2>High Scores</h2>
            <div className="high-scores-list">
                <p>{message}</p>
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {highScores.map((score, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.userName}</td>
                            <td>{score.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HighScores;