import React from "react";

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: "",
      result: ""
    };
  }

  factorial = () => {
    let num = parseInt(this.state.num);
    let fact = 1;
    for (let i = 1; i <= num; i++) {
      fact *= i;
    }
    this.setState({ result: fact });
  };

  isPrime = () => {
    let num = parseInt(this.state.num);
    if (num <= 1) {
      this.setState({ result: "Not Prime" });
      return;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        this.setState({ result: "Not Prime" });
        return;
      }
    }
    this.setState({ result: "Prime" });
  };

  isArmstrong = () => {
    let num = parseInt(this.state.num);
    let sum = 0;
    let temp = num;

    while (temp > 0) {
      let remainder = temp % 10;
      sum += Math.pow(remainder, 3);
      temp = Math.floor(temp / 10);
    }

    if (sum === num) {
      this.setState({ result: "Armstrong" });
    } else {
      this.setState({ result: "Not Armstrong" });
    }
  };

  clearResult = () => {
    this.setState({ result: "", num: "" });
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  }}>

        <div >
          <label>Number:</label>
          <input
            type="number"
            value={this.state.num}
            onChange={(e) => {
              this.setState({ num: e.target.value });
            }}
          />
        </div>        
        <br></br>
        <div >
        <button style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', marginRight: '10px'}} onClick={this.factorial}>Factorial</button>
        <button style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', marginRight: '10px' }} onClick={this.isPrime}>Check Prime</button>
        <button style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', marginRight: '10px' }} onClick={this.isArmstrong}>Check Armstrong</button>
        <button style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', marginRight: '10px' }} onClick={this.clearResult}>Clear</button>

        </div>
        <br></br>
        <div >
          <label>Result:</label>
          <input type="text" value={this.state.result} readOnly />
        </div>
      </div>
    );
  }
}

export default Comp;
