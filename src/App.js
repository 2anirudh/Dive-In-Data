import './App.css';
import Logo from './Logo.png';
import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar,  PieChart, Pie, Cell } from 'recharts';


const COLORS = ['#2196F3', '#FF5722', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4', '#E91E63', '#FF9800', '#8BC34A', '#673AB7'];


const CSVDisplay = () => {
  const [csvData, setCsvData] = useState([]);
  const [statisticResult, setStatisticResult] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [lineGraphData, setLineGraphData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [xlineValue, setxLineValue] = useState('');
  const [ylineValue, setyLineValue] = useState('');
  const [xbarValue, setxBarValue] = useState('');
  const [ybarValue, setyBarValue] = useState('');
  const [pieValue, setPieValue] = useState('');


  const handleCsvData = (data) => {
    setCsvData(data);
  };

  const handleSelectChange = (event) => {
    setSelectedColumn(event.target.value);
    setStatisticResult('');
  };

  const removeEmptyRows = () => {
    const filteredData = csvData.filter(row => Object.values(row).some(value => value !== null && value !== ''));
    setCsvData(filteredData);
  };

  const dropEmptyColumns = () => {
    const emptyColumns = Object.keys(csvData[0]).filter(key => csvData.every(row => !row[key]));
    const filteredData = csvData.map(row => {
      const newRow = { ...row };
      emptyColumns.forEach(column => delete newRow[column]);
      return newRow;
    });
    setCsvData(filteredData);
  };

  const removeDuplicateRows = () => {
    const uniqueData = [...new Map(csvData.map(row => [JSON.stringify(row), row])).values()];
    setCsvData(uniqueData);
  };

  const removeCorruptedData = () => {
    const filteredData = csvData.filter(row => {
      return Object.values(row).every(value => typeof value === 'string' && !/^[*&#?><]+$/.test(value));
    });
    setCsvData(filteredData);
  };
  
  const dropSameColumns = () => {
    var filteredColumns = [];
    var Columns = Object.keys(csvData[0]);
    var notreq=[];

    for (let j = 0 ; j < Columns.length; j++){
      for(let k = j+1; k < Columns.length; k++){
        var flag = true;
        for (let i = 0 ; i<csvData.length;i++){
          if(csvData[i][Columns[j]] !== csvData[i][Columns[k]]){
            flag = false;
            break;
          }
        }
        if(flag){
          notreq.push(Columns[k])
        }
      }
    }
    for (let i in Columns){
      if (!notreq.includes(Columns[i])){
        filteredColumns.push(Columns[i])
      }
    }
    
    console.log(filteredColumns);
    const filteredData = csvData.map(row =>
        Object.fromEntries(filteredColumns.map(column => [column, row[column]]))
    );
    setCsvData(filteredData);
  };

  const convertToCSV = (data) => {
    const array = typeof data !== 'object' ? JSON.parse(data) : data;
    let str = '';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line !== '') line += ',';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  };

  const downloadCSVFile = () => {
    const csvData1 = new Blob([convertToCSV(csvData)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData1);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = 'Updated.csv';
    link.click();
  };

  const calculateStatistic = (statistic) => {
    if (csvData.length === 0 || !selectedColumn) return;
  
    let values = csvData.map(row => parseFloat(row[selectedColumn])).filter(value => !isNaN(value));
  
    let result;
    let mean;
    switch (statistic) {
      case 'Mean':
        result = values.reduce((acc, curr) => acc + curr, 0) / values.length;
        break;
      case 'Median':
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        result = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
        break;
      case 'Mode':
        let frequencyMap = {};
        values.forEach(value => {
          frequencyMap[value] = (frequencyMap[value] || 0) + 1;
        });
        let maxFrequency = 0;
        let modes = [];
        for (let value in frequencyMap) {
          if (frequencyMap[value] > maxFrequency) {
            modes = [value];
            maxFrequency = frequencyMap[value];
          } else if (frequencyMap[value] === maxFrequency) {
            modes.push(value);
          }
        }
        result = modes.join(', ');
        break;
        case 'Variance':
          mean = values.reduce((acc, curr) => acc + curr, 0) / values.length; 
          const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
          result = squaredDifferences.reduce((acc, curr) => acc + curr, 0) / values.length;
          break;
        case 'Standard Deviation':
          mean = values.reduce((acc, curr) => acc + curr, 0) / values.length; 
          const variance = values.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / values.length;
          result = Math.sqrt(variance);
          break;
        default:
          result = '';
      }
      result = parseFloat(result);
      console.log(typeof(result));
      if (!isNaN(result)) { 
        setStatisticResult(result.toFixed(2));
      } else {
        setStatisticResult('');
      }
    };
  
  const plotline = () => {
    if (csvData.length === 0) return;
  
    const data = csvData.map(row => ({
      x: row[xlineValue], 
      y: row[ylineValue] 
    }));
    console.log(data);
    setLineGraphData(data);
  };

  const plotBarChart = () => {
    if (csvData.length === 0) return;
  
    const data = csvData.map(row => ({
      x: row[xbarValue], 
      y: row[ybarValue]
    }));
    console.log(data);
    setBarChartData(data);
  };
  
  const plotPieChart = (columnName) => {
    if (csvData.length === 0) return;

    const categoryCounts = {};
    csvData.forEach(row => {
        const category = row[columnName];
        if (categoryCounts[category]) {
            categoryCounts[category]++;
        } else {
            categoryCounts[category] = 1;
        }
    });

    const data = Object.entries(categoryCounts).map(([category, count]) => ({
        name: category,
        value: count
    }));

    setPieChartData(data);
  };

  const numericalColumns = csvData.length > 0 ? Object.keys(csvData[0]).filter(column => {
    return csvData.every(row => !isNaN(parseFloat(row[column])));
  }) : [];

  return (
    <div class = "body">
      <div class = "title">
        <h1>Dive in Data</h1>
        <img src={Logo}  alt="DID"/>
      </div>
      <CSVReader
        class="file-upload-btn"
        onFileLoaded={handleCsvData}
        parserOptions={{
          header: true,
          skipEmptyLines: true
        }}
      />
      <h2 class="headings">CSV Data</h2>
      <div class = "table-container" style={{ height: '400px', overflow: 'auto' }}>
        <table class="table">
          <thead>
            <tr>
              {csvData.length > 0 && Object.keys(csvData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button class="button" onClick={removeEmptyRows}>Remove Empty Rows</button>
        <button class="button" onClick={dropEmptyColumns}>Drop Empty Columns</button>
        <button class="button" onClick={removeDuplicateRows}>Remove Duplicate Rows</button>
        <button class="button" onClick={dropSameColumns}>Drop Duplicate Columns</button>
        <button class="button" onClick={removeCorruptedData}>Remove Corrupted Rows</button>
      </div>
      <div style={{ textAlign: 'center' }}>
      <button class = "button" onClick={downloadCSVFile}>Download CSV</button>
      </div>
      <div>
        <h2 class="headings">Select a Numerical Column:</h2>
      </div>
      <div class="container">
        <div class="select-container">
          <select value={selectedColumn} onChange={handleSelectChange}>
            <option value="">Select...</option>
            {numericalColumns.map((column, index) => (
              <option key={index}>{column}</option>
            ))}
          </select>
        </div>
        <div class="button-container">
          <button class="button" onClick={() => calculateStatistic('Mean')}>Mean</button>
          <button class="button" onClick={() => calculateStatistic('Median')}>Median</button>
          <button class="button" onClick={() => calculateStatistic('Mode')}>Mode</button>
          <button class="button" onClick={() => calculateStatistic('Variance')}>Variance</button>
          <button class="button" onClick={() => calculateStatistic('Standard Deviation')}>Standard Deviation</button>
        </div>
        <div class = "button-container" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2em' }}>
                    {statisticResult && <p>{statisticResult}</p>}
        </div>
      </div>

      <div>
        <h2 class="headings">Statistical Calculations:</h2>
        <br></br>
        <h2 class="headings">Line Graph:</h2>
        <div class = "drop-container">
          <select value={xlineValue} onChange={(event)=>setxLineValue(event.target.value)} placeholder='X-Axis'>
            <option value="">X-Axis</option>
            {csvData.length > 0 && Object.keys(csvData[0]).map((column, index) => (
              <option key={index}>{column}</option>
            ))}
          </select>
          <select value={ylineValue} onChange={(event)=>setyLineValue(event.target.value)} placeholder='Y-Axis'>
            <option value="">Y-Axis</option>
            {csvData.length > 0 && Object.keys(csvData[0]).map((column, index) => (
              <option key={index}>{column}</option>
            ))}
          </select>
          <button class="button" onClick={() => plotline()} style={{width: "200px"}}>Plot Line Graph</button>
        </div>
        
        <LineChart width={600} height={300} data={lineGraphData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="x" />
          <YAxis dataKey={"y"}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#8884d8"/>
        </LineChart>
      </div>

      <div>
        <h2 class="headings">Bar Plot:</h2>
        <div class = "drop-container">
          <select value={xbarValue} onChange={(event)=>setxBarValue(event.target.value)}placeholder='X-Axis'>
            <option value="">X-Axis</option>
            {csvData.length > 0 && Object.keys(csvData[0]).map((column, index) => (
              <option key={index}>{column}</option>
            ))}
          </select>
          <select value={ybarValue} onChange={(event)=>setyBarValue(event.target.value)}placeholder='Y-Axis'>
            <option value="">Y-Axis</option>
            {csvData.length > 0 && Object.keys(csvData[0]).map((column, index) => (
              <option key={index}>{column}</option>
            ))}
          </select>
          <button class="button" onClick={() => plotBarChart()} style={{width: "200px"}}>Plot Bar Chart</button>
        </div>
        <BarChart width={600} height={300} data={barChartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#8884d8" />
        </BarChart>
      </div>

      <div>
        <h2 class="headings">Pie Chart:</h2>
        <div class = "drop-container">
        <select value={pieValue} onChange={(event)=>setPieValue(event.target.value)}>
            <option value="">X-Axis</option>
            {csvData.length > 0 && Object.keys(csvData[0]).map((column, index) => (
              <option key={index}>{column}</option>
            ))}
          </select>
          <button class="button" onClick={() => plotPieChart(pieValue)} style={{width: "200px"}}>Plot Pie Chart</button>
        </div>
        <PieChart width={400} height={400}>
          <Pie
            data={pieChartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default CSVDisplay;


