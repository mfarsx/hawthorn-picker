class RandomPicker extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      isRunning: false,
      currentChoice: "?",
      classNo: "",
      nameList: [],
    };

    this.interval = null;
    this.intervalDuration = 25;
    this.duration = 1000;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.pickChoice = this.pickChoice.bind(this);
    this.setChoice = this.setChoice.bind(this);
  }

  start() {
    clearInterval(this.interval);
    this.interval = setInterval(this.setChoice, this.intervalDuration);
    this.setState({ isRunning: true });
    setTimeout(() => {
      if (this.state.isRunning) {
        this.stop();
      }
    }, this.duration);
  }

  stop() {
    clearInterval(this.interval);
    this.setState({ isRunning: false });
  }

  reset() {
    clearInterval(this.interval);
    this.setState({ isRunning: false, currentChoice: "" });
  }

  getNameListFromStorage(classNo) {
    let namesList;

    if (localStorage.getItem(classNo) === null) {
      namesList = [];
    } else {
      namesList = JSON.parse(localStorage.getItem(classNo));
    }
    return namesList;
  }

  setNameList() {
    this.setState({
      nameList: this.getNameListFromStorage(this.state.classNo),
    });
  }

  pickChoice() {
    const { items } = this.props;
    const choice = items[Math.floor(Math.random() * items.length)];
    return choice;
  }

  setChoice() {
    this.setState({ currentChoice: this.pickChoice() });
  }

  render() {
    const { isRunning, currentChoice } = this.state;

    return (
      <div className="RandomPicker">
        <RandomPickerChoice choice={currentChoice} />
        <RandomPickerControls
          isRunning={isRunning}
          hasChoice={currentChoice.trim().length > 0}
          start={this.start}
          stop={this.stop}
          reset={this.reset}
        />
      </div>
    );
  }
}

RandomPicker.propTypes = {
  items: PropTypes.array,
  duration: PropTypes.number,
};

class RandomPickerChoice extends React.PureComponent {
  render() {
    const { choice } = this.props;
    const content = choice.trim().length > 0 ? choice : "?";

    return (
      <div className="RandomPicker__choice">
        <span className="RandomPicker__choiceItem">{content}</span>
      </div>
    );
  }
}

RandomPickerChoice.propTypes = {
  choice: PropTypes.string,
};

class RandomPickerControls extends React.PureComponent {
  render() {
    const { isRunning, hasChoice, start, stop, reset } = this.props;

    return (
      <div className="RandomPicker__controls">
        <button
          class={`RandomPicker__button ${
            isRunning && "RandomPicker__button--stop"
          }`}
          onClick={isRunning ? stop : start}
        >
          {isRunning ? "stop" : "start"}
        </button>
        <button
          disabled={isRunning || !hasChoice}
          class="RandomPicker__button RandomPicker__button--reset"
          onClick={reset}
        >
          reset
        </button>
      </div>
    );
  }
}

RandomPickerControls.propTypes = {
  isRunning: PropTypes.bool,
  hasChoice: PropTypes.bool,
  start: PropTypes.func,
  stop: PropTypes.func,
  reset: PropTypes.func,
};

function getNameListFromStorage() {
  let namesList;

  if (localStorage.getItem("classNo") === null) {
    namesList = [];
  } else {
    namesList = JSON.parse(localStorage.getItem("classNo"));
  }
  return namesList;
}

const namesList = getNameListFromStorage();

ReactDOM.render(
  <RandomPicker items={namesList} />,
  document.getElementById("random-picker")
);
