import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import HighScores from "./HighScores";



function App() {

    // here we define 7 different state variables for the number that needs to be guessed, user's guess, history of guesses
    // which message, user's name, if the game is won, and submitting the score.

    const [numberToGuess, setNumberToGuess] = useState("");
    const [guess, setGuess] = useState("");
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [userName, setUserName] = useState("");
    const [isGameWon, setIsGameWon] = useState(false);
    const [hasSubmittedScore, setHasSubmittedScore] = useState(false);



    // this useEffect hook runs a function when the component mounts, initializing a number to guess.
    useEffect(() => {
        generateNumberToGuess();
    }, []);

    // generates a random 4-digit number to guess.
    const generateNumberToGuess = () => {
        let digits = [0,1,2,3,4,5,6,7,8,9];
        let number = "";
        for (let i = 0; i < 4; i++) {
            const index = Math.floor(Math.random() * digits.length);
            number += digits[index];
            digits.splice(index, 1);
        }
        setNumberToGuess(number);
        console.log(number);
    };



    // this is an asynchronous function that sends a POST request with the user's name and score to the server, updating
    // the message based on the success or failure of the request.


    const submitScore = async () => {
        const scoreData = {userName, score: history.length + 1};

        try {
            const response = await fetch("/java_react_war/api/highscores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(scoreData),
            });

            if (response.status === 200) {
                setMessage("Score submitted successfully");
            } else {
                setMessage("Failed to submit score");
            }
        } catch (error) {
            setMessage("Failed to submit score");
        }
    };


    // handle the user's guess.
    const handleGuess = () => {
        let bulls = 0;
        let cows = 0;

        for (let i = 0; i < 4; i++) {
            if (guess[i] === numberToGuess[i]) {
                bulls++;
            } else if (numberToGuess.includes(guess[i])) {
                cows++;
            }
        }

        setMessage(`Bulls: ${bulls}, Cows: ${cows}`);

        if (bulls === 4) {
            setMessage("You won!");
            setIsGameWon(true);
        } else {
            setHistory([{ guess, bulls, cows }, ...history]);
        }
    };

    // render the history of guesses.

    const renderHistory = () => {
        return (
            <div>
                <h3>History:</h3>
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>
                            Guess: {item.guess}, Bulls: {item.bulls}, Cows: {item.cows}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };




    // resets the game state by generating a new number to guess, clearing the user's input, and resetting game and
    // score submission status.
    const handleNewGame = () => {
        generateNumberToGuess();
        setGuess("");
        setHistory([]);
        setMessage("");
        setIsGameWon(false);
        setHasSubmittedScore(false);
    };

    //validating name is only letters.
    const isNameValid = (name) => {
        return /^[A-Za-z]+$/.test(name);
    };

    //prevents the form's default behavior, checks if user's name is valid and if valid it will call submitScore function.
    const handleNameSubmit = (event) => {
        event.preventDefault();

        if (isNameValid(userName)) {
            submitScore();
            setHasSubmittedScore(true);
        } else {
            setMessage("Please enter a valid name (only letters are allowed).");
        }
    };

    // this return will render the layout of the game which includes a picture, the instructions of the game, a form for
    // the user to guess and for the user to submit a name for when the user won, high scores component, history of guesses
    // and a new game button.


    return (
        <div className="App">
            <Container>
                <Row>
                    <Col>
                        <img src="https://vmsoft-bg.com/wp-content/uploads/2019/02/Feature-graphic_en.png" alt="Your description here" style={{maxWidth: '70%', height: '100%'}} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Bulls and Cows Game</h1>
                        <p>Guess the 4-digit number!! Each digit can only be used once</p>
                        {!hasSubmittedScore && (
                            <Form>
                                <Form.Group controlId="guess">
                                    <Form.Label>Your Guess:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your guess"
                                        value={guess}
                                        onChange={(event) => setGuess(event.target.value)}
                                        />
                                </Form.Group>
                                <Button onClick={handleGuess}>Guess</Button>
                            </Form>
                        )}
                        <p>{message}</p>
                        {isGameWon && !hasSubmittedScore && (
                            <Form onSubmit={handleNameSubmit}>
                                <Form.Group controlId="userName">
                                    <Form.Label>Your Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={userName}
                                        onChange={(event) => setUserName(event.target.value)}
                                    />
                                </Form.Group>
                                <Button type="submit">Submit Score</Button>
                            </Form>
                        )}
                        {hasSubmittedScore && <HighScores score={history.length + 1} />}
                        {renderHistory()}
                        <Button onClick={handleNewGame} className="ml-2">New Game</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;