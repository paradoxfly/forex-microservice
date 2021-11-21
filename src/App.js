import './App.css';
import React from 'react'
import Base from './Components/Base';
import Table from './Components/Table';
import changeBase from './Utils/change-base';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      base: '', 
      data: {
        base: "USD",
        date: "2021-11-11",
        rates: {}
      }}

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    fetch('https://forex-microservice-api.herokuapp.com/forex/latest/currencies/USD')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState( { 
          data: data,
          base: data.base
        })
      })
      .catch(error => console.log(error))
  }

  handleChange(event) {
    this.setState({
      base: event.target.value,
      data: changeBase(event.target.value, this.state.data)
    })
  }


  render(){
    return (
      <div className="App">
        <Base onChange = { this.handleChange } base = { this.state.base } />
        <Table data = { this.state.data }/>
      </div>
    );
  } 
}

export default App;
