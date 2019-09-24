import React from 'react';
import axios from 'axios';

class HealthCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentWeightInKG: 0,
      percentage: '0'
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.checkHealth(), 5000)
    this.checkHealth()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkHealth = () => {
    let headers = {
      'X-M2X-KEY': 'be2c077113000e2388658e1040845db5'
    }
    let AxiosConfig = {
      headers,
      url: 'https://api-m2x.att.com/v2/devices/68b46af566ab20ed3b02622fbd273bb7/streams/keg-weight/values?limit=1',
      method: 'GET'
    }
    axios(AxiosConfig)
      .then(response => {
        let data = response.data.values[0]
        this.setState({
          currentWeightInKG: data.value,
          stylePercentage: (100 - this.convertToPercentage(data.value)) + '%',
          percentage: this.convertToPercentage(data.value)
        })
      })
  }

  convertToPercentage = (weightInKg) => {
    let convertedWeight = (weightInKg - 4.08)/22.23 * 100
    if (convertedWeight > 100) {
      convertedWeight = 100
    } else if (convertedWeight < 0) {
      convertedWeight = 0
    }
    return Math.round(convertedWeight)
  }

  render() {
    return (
      <div>
        <div className="coffee-container">
            <div className="coffee-stroke">
                <div className="coffee-indicator">
                  <div className="coffee-indicator-black" style={{height: this.state.stylePercentage}}/>
                </div>
            </div>
        </div>
        <div>{this.state.percentage}%</div>
      </div>
    )
  }
}

export default HealthCheck