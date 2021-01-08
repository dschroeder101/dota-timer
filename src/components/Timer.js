import React, { Component } from "react";
import { Jumbotron, Form, Button, Row, Col } from "react-bootstrap";
// import { useSpeechSynthesis } from 'react-speech-kit';

class Timer extends Component {
  
  constructor(props) {
    super(props);
    this.handleStart = this.handleStart.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    
    this.speaker = new SpeechSynthesisUtterance();

    this.startingPhrases = [
      "May the all anus be with you",
      "Godspeed, the all anus smiles upon you this day",
      "Do not get peenisy, kid",
      "Give them a good rogering",
      "Your team comp is horrible, you'll probably lose",
      "I hope you're not tilted after that last game",
      "I long for death, but death will not come",
      "Try to hit 100 creep score this game, you casual",
      "Nic, don't forget to hit the nexus",
      "Let me guess, Quin is playing Windranger",
      "Uh oh, Christian is playing a broken hero",
      "Alex in ten minutes: Oh no, they're killing me, oh no, I'm dead"
    ]

    this.bountiesIn30SecondsPhrases = [
      "Bounties available in thirty seconds"
    ]

    this.bountyAvailablePhrases = [
      "Get the bounty you filthy casual",
      "Bounties spawned, get on it",
      "Get the bounty you try hard",
    ]

    this.runesIn30SecondsPhrases = [
      "Power runes in thirty seconds"
    ]

    this.runesAvailablePhrases = [
      "Power rune just spawned"
    ]

    this.tier1ItemsAvailablePhrases = [
      "Tier one items now available"
    ]

    this.tier2ItemsAvailablePhrases = [
      "Tier two items now available"
    ]

    this.tier3ItemsAvailablePhrases = [
      "Tier three items now available"
    ]

    this.tier4ItemsAvailablePhrases = [
      "Tier four items now available"
    ]

    this.tier5ItemsAvailablePhrases = [
      "Tier five items now available"
    ]

    this.siegeCreepSpawnedPhrases = [
      "Siege creep wave just spawned"
    ]

    this.voices = speechSynthesis.getVoices();

    this.state = {
      text: "00:00",
      running: false,
      seconds: 0,
      minutes: 0,
      inputSeconds: 0,
      inputMinutes: 0,
    };
  }

  handleStart = () => {
    if (!this.state.running) {
      this.setState({ running: true });
      this.watch = setInterval(() => this.step(), 1000);
    }

    this.alert([this.startingPhrases[this.getRandomNumber(this.startingPhrases.length)]]);
  };

  handlePause = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
  };

  handleReset = () => {
    this.setState({
        minutes: 0,
        seconds: 0,
        text: '00:00',
      });
      clearInterval(this.watch);
      this.handlePause();
  };

  format = () =>{
    return `${pad0(this.state.minutes)}:${pad0(this.state.seconds)}`;
  };

  calculate = () => {
    this.state.seconds += 1;
    if (this.state.seconds >= 60){
      this.state.minutes += 1;
      this.state.seconds = 0;
    }
    let phrases = this.determinePhrase();

    if (phrases.length > 0) {
      this.alert(phrases);
    }
  };

  determinePhrase = () => {

    let result = [];

    // Bounties and creep waves available every 5 minutes
    if (this.state.minutes % 5 === 0 && this.state.seconds === 0) {
      result.push(this.bountyAvailablePhrases[this.getRandomNumber(this.bountyAvailablePhrases.length)]);
      result.push(this.siegeCreepSpawnedPhrases[this.getRandomNumber(this.siegeCreepSpawnedPhrases.length)]);
    }

    // 30 second warning for bounties 
    if (((this.state.minutes + 1) % 5 === 0) && (this.state.seconds === 30)) {
      result.push(this.bountiesIn30SecondsPhrases[this.getRandomNumber(this.bountiesIn30SecondsPhrases.length)]);
    }

    // Power runes available at 4 minutes, and every 2 minutes after that
    if ((this.state.minutes === 4 && this.state.seconds === 0) || (this.state.minutes > 4 && this.state.minutes % 2 === 0 && this.state.seconds === 0)) {
      result.push(this.runesAvailablePhrases[this.getRandomNumber(this.runesAvailablePhrases.length)]);
    } 

    // 30 second warning for power runes
    if ((this.state.minutes > 2 && (this.state.minutes + 1) % 2 === 0) && (this.state.seconds === 30)) {
      result.push(this.runesIn30SecondsPhrases[this.getRandomNumber(this.runesIn30SecondsPhrases.length)]);
    }

    // Tier 1 weapons available
    if (this.state.minutes === 7 && this.state.seconds === 0) {
      result.push(this.tier1ItemsAvailablePhrases[this.getRandomNumber(this.tier1ItemsAvailablePhrases.length)]);
    }

    // Tier 2 weapons available
    if (this.state.minutes === 17 && this.state.seconds === 0) {
      result.push(this.tier2ItemsAvailablePhrases[this.getRandomNumber(this.tier2ItemsAvailablePhrases.length)]);
    }

    // Tier 3 weapons available
    if (this.state.minutes === 27 && this.state.seconds === 0) {
      result.push(this.tier3ItemsAvailablePhrases[this.getRandomNumber(this.tier3ItemsAvailablePhrases.length)]);
    }

    // Tier 4 weapons available
    if (this.state.minutes === 37 && this.state.seconds === 0) {
      result.push(this.tier4ItemsAvailablePhrases[this.getRandomNumber(this.tier4ItemsAvailablePhrases.length)]);
    }

    // Tier 5 weapons available
    if (this.state.minutes === 60 && this.state.seconds === 0) {
      result.push(this.tier5ItemsAvailablePhrases[this.getRandomNumber(this.tier5ItemsAvailablePhrases.length)]);
    }
    
    return result;
  }

  step = () => {
    if (!this.state.running) return
      this.calculate();
      this.print();
    };

  print = () => {
      this.setState({text : this.format()});
  };

  alert = (phrases) => {
      phrases.forEach(phrase => {
        let speaker = new SpeechSynthesisUtterance(phrase);
        speaker.voice = this.voices.filter(function(voice) { return voice.name === "Google UK English Male";})[0];
        console.log(speaker.voice)
        speechSynthesis.speak(speaker);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.handlePause();
    this.state.minutes = this.state.inputMinutes;
    this.state.seconds = this.state.inputSeconds;
    this.print();
  }

  handleSecondsChange = (e) => {
    this.state.inputSeconds = Number(e.target.value);
  }

  handleMinutesChange = (e) => {
    this.state.inputMinutes = Number(e.target.value);
  }

  getRandomNumber = (max) => {
    return Math.floor(Math.random() * (max));
  }

  render() {
    return (
      <div className="app">
        <Jumbotron className="timerJumbotron">
          <div clasname="timer">
            <h2 className="title">Praise the All-Anus!!</h2>
            <div className="timerText">{this.state.text}</div>
            <Button className="timerButton" variant="success" onClick={this.handleStart}>Start</Button>
            <Button className="timerButton" variant="warning" onClick={this.handlePause}>Pause</Button>
            <Button className="timerButton" variant="danger" onClick={this.handleReset}>Reset</Button>
          </div>
          <div className="timerInput">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col>
                <Form.Control placeholder="Minutes" type="text" onChange={this.handleMinutesChange}></Form.Control>
              </Col>
              <Col>
                <Form.Control placeholder="Seconds" type="text" onChange={this.handleSecondsChange}></Form.Control>
              </Col>
              <Button type="submit">Set Timer</Button>
            </Row>
          </Form>
          </div>
        </Jumbotron>
      </div>
    );
  }
}

function pad0(value){
    let result = value.toString();
    if (result.length < 2){
      result = '0' + result;
    }
    return result;
  }

export default Timer;
