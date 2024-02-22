import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { withStyles } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
import { Graph } from './graph';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(() => ({
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
}));

export const VisualizationPage = props => {
  const classes = useStyles();

  const [state, setState] = useState({
    readings: [],
    equation: 'x ^ 2',
    points: [],
    xMin: -10,
    xMax: 10,
    yMin: 0,
    yMax: 20,
    resoultion: 1,
    hasError: false,
  });

  const checkInputs = () => {
    let err = false;
    if (isNaN(parseFloat(state.xMin))) {
      err = true;
    }
    if (isNaN(parseFloat(state.xMax))) {
      err = true;
    }
    if (isNaN(parseFloat(state.yMin))) {
      err = true;
    }
    if (isNaN(parseFloat(state.yMax))) {
      err = true;
    }
    if (isNaN(parseFloat(state.resoultion))) {
      err = true;
    }
    setState({
      hasError: err,
    });
    return !err;
  };

  const parseEquation = () => {
    if (!checkInputs()) {
      return;
    }
    const arr = state.equation.split(' ').join('');
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
        let i = parseFloat(state.xMin);
        i <= parseFloat(state.xMax);
        i += parseFloat(1 / state.resoultion)
      ) {
        newSet.push({
          x: i,
          y: getValue(tree, i),
        });
      }
    } catch (e) {
      setState({
        hasError: true,
      });
    }

    setState({
      points: newSet,
    });
  };

  const getValue = (tree, value) => {
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
        return getValue(tree.left, value) + getValue(tree.right, value);
      case '-':
        return getValue(tree.left, value) - getValue(tree.right, value);
      case '*':
        return getValue(tree.left, value) * getValue(tree.right, value);
      case '/':
        return getValue(tree.left, value) / getValue(tree.right, value);
      case '^':
        return Math.pow(getValue(tree.left, value), getValue(tree.right, value));
    }
  };

  useEffect(() => {
    parseEquation();
  }, []);

  const handleEqInput = e => event => {
    setState(
      {
        equation: event.target.value,
      },
      parseEquation,
    );
  };

  const handleRangeInput = e => event => {
    setState(
      {
        [e]: event.target.value,
      },
      parseEquation,
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.paper} elevation={4}>
        <div variant="headline" component="h3" className={classes.graphTitle}>
          Graphing Calculator
        </div>
        <Graph
          points={state.points}
          ranges={{
            xMin: state.xMin,
            xMax: state.xMax,
            yMin: state.yMin,
            yMax: state.yMax,
          }}
        />
        {state.hasError && (
          <div className={classes.errorMessage}>Could not understand input parameters.</div>
        )}
        <div className={classes.extras}>
          <div className={classes.inputContainer}>
            <table>
              <tbody>
                <tr>
                  <td>Enter your equation:</td>
                  <td>
                    <input
                      type="text"
                      value={state.equation}
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
                      value={state.xMin}
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
                      value={state.xMax}
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
                      value={state.yMin}
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
                      value={state.yMax}
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
                      value={state.resoultion}
                      onChange={handleRangeInput('resoultion')}
                      aria-label={'Resoultion of the graph line'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={classes.descriptionContainer}>
            This is an example of some custom graphing using the D3 library. You can enter an
            equation on the left side and set the dimensions and resoultion of the graph. The
            calculator is pretty basic as I made the parser from scratch. So far it only supports +,
            -, *, /, ^, and does not support order of operations.
          </div>
        </div>
      </div>
    </div>
  );
};
