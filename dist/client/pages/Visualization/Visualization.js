import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Graph from './graph';

const styles = theme => ({
  root: {
    margin: '16px',
  },
  paper: {
    padding: '20px',
    textAlign: 'center',
  },
  graphTitle: {
    textAlign: 'center',
  },
  statsContianer: {
    flexGrow: 1,
  },
  inputContainer: {
    flexGrow: 1,
  },
  descriptionContainer: {
    flexGrow: 1,
    maxWidth: '50%',
    marginRight: '20px',
    marginLeft: '12px',
    textAlign: 'justify',
  },
  extras: {
    display: 'flex',
    textAlign: 'left',
  },
  list: {
    listStyleType: 'none',
  },
  errorMessage: {
    color: 'red',
  },
});

export class VisualizationPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    readings: [],
    equation: 'x ^ 2',
    points: [],
    xMin: -10,
    xMax: 10,
    yMin: 0,
    yMax: 20,
    resoultion: 1,
    hasError: false,
  };

  checkInputs() {
    let err = false;
    if (isNaN(parseFloat(this.state.xMin))) {
      err = true;
    }
    if (isNaN(parseFloat(this.state.xMax))) {
      err = true;
    }
    if (isNaN(parseFloat(this.state.yMin))) {
      err = true;
    }
    if (isNaN(parseFloat(this.state.yMax))) {
      err = true;
    }
    if (isNaN(parseFloat(this.state.resoultion))) {
      err = true;
    }
    this.setState({
      hasError: err,
    });
    return !err;
  }

  parseEquation() {
    if (!this.checkInputs()) {
      return;
    }
    const arr = this.state.equation.split(' ').join('');
    let tree = {
      left: null,
      right: null,
      value: null,
    };
    for (let i = 0; i < arr.length; i++) {
      let value = arr[i];
      switch (arr[i]) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
          tree = {
            left: tree,
            value: value,
            right: null,
          };
          break;
        default:
          if (!isNaN(parseInt(value))) {
            let cursor = 1;
            while (!isNaN(parseInt(arr[i + cursor]))) {
              value = value + arr[i + cursor];
              cursor++;
            }
            i += cursor - 1;
          }
          if (tree.value === null) {
            tree.value = value;
          } else if (tree.left === null) {
            tree.left = {
              left: null,
              right: null,
              value: value,
            };
          } else if (tree.right === null) {
            tree.right = {
              left: null,
              right: null,
              value: value,
            };
          }
      }
    }
    const newSet = [];
    try {
      for (
        let i = parseFloat(this.state.xMin);
        i <= parseFloat(this.state.xMax);
        i += parseFloat(1 / this.state.resoultion)
      ) {
        newSet.push({
          x: i,
          y: this.getValue(tree, i),
        });
      }
    } catch (e) {
      this.setState({
        hasError: true,
      });
    }

    this.setState({
      points: newSet,
    });
  }

  getValue(tree, value) {
    // leaf node
    if (tree.left === null && tree.right === null) {
      if (isNaN(parseInt(tree.value))) {
        return value;
      }
      return parseInt(tree.value);
    }

    // operator
    switch (tree.value) {
      case '+':
        return this.getValue(tree.left, value) + this.getValue(tree.right, value);
      case '-':
        return this.getValue(tree.left, value) - this.getValue(tree.right, value);
      case '*':
        return this.getValue(tree.left, value) * this.getValue(tree.right, value);
      case '/':
        return this.getValue(tree.left, value) / this.getValue(tree.right, value);
      case '^':
        return Math.pow(this.getValue(tree.left, value), this.getValue(tree.right, value));
    }
  }

  componentDidMount() {
    this.parseEquation();
  }

  render() {
    const handleEqInput = e => event => {
      this.setState(
        {
          equation: event.target.value,
        },
        this.parseEquation,
      );
    };

    const handleRangeInput = e => event => {
      this.setState(
        {
          [e]: event.target.value,
        },
        this.parseEquation,
      );
    };

    return (
      <div className={this.props.classes.root}>
        <Paper className={this.props.classes.paper} elevation={4}>
          <Typography variant="headline" component="h3" className={this.props.classes.graphTitle}>
            Graphing Calculator
          </Typography>
          <Graph
            points={this.state.points}
            ranges={{
              xMin: this.state.xMin,
              xMax: this.state.xMax,
              yMin: this.state.yMin,
              yMax: this.state.yMax,
            }}
          />
          {this.state.hasError && (
            <div className={this.props.classes.errorMessage}>
              Could not understand input parameters.
            </div>
          )}
          <div className={this.props.classes.extras}>
            <div className={this.props.classes.inputContainer}>
              <table>
                <tbody>
                  <tr>
                    <td>Enter your equation:</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.equation}
                        onChange={handleEqInput('name')}
                        aria-label={'Equation input'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>X Minimum:</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.xMin}
                        onChange={handleRangeInput('xMin')}
                        aria-label={'X axis minimum'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>X Maximum</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.xMax}
                        onChange={handleRangeInput('xMax')}
                        aria-label={'X axis maximum'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Y Minimum</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.yMin}
                        onChange={handleRangeInput('yMin')}
                        aria-label={'Y axis minimum'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Y Maximum</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.yMax}
                        onChange={handleRangeInput('yMax')}
                        aria-label={'Y axis Maximum'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Resoultion</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.resoultion}
                        onChange={handleRangeInput('resoultion')}
                        aria-label={'Resoultion of the graph line'}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={this.props.classes.descriptionContainer}>
              This is an example of some custom graphing using the D3 library. You can enter an
              equation on the left side and set the dimensions and resoultion of the graph. The
              calculator is pretty basic as I made the parser from scratch. So far it only supports
              +, -, *, /, ^, and does not support order of operations.
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(VisualizationPage);
