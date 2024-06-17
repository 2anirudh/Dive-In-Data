const DataAnalyzer = ({ csvData }) => {
  const [graphType, setGraphType] = useState('');
  const [inputColumns, setInputColumns] = useState([]);

  const handleGraphTypeChange = (event) => {
    setGraphType(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputColumns(event.target.value);
  };

  const renderGraph = () => {
    if (graphType === 'lineChart' && inputColumns.length === 1) {
      return (
        <div>
          <h2>Line Chart</h2>
          {/* Render line chart based on input column */}
        </div>
      );
    } else if (graphType === 'barChart' && inputColumns.length >= 1) {
      return (
        <div>
          <h2>Bar Chart</h2>
          {/* Render bar chart based on input columns */}
        </div>
      );
    } else if (graphType === 'pieChart' && inputColumns.length === 1) {
      return (
        <div>
          <h2>Pie Chart</h2>
          {/* Render pie chart based on input column */}
        </div>
      );
    } else if (graphType === 'histogram' && inputColumns.length === 1) {
      return (
        <div>
          <h2>Histogram</h2>
          {/* Render histogram based on input column */}
        </div>
      );
    } else if (graphType === 'heatmap' && inputColumns.length >= 2) {
      return (
        <div>
          <h2>Heatmap</h2>
          {/* Render heatmap based on input columns */}
        </div>
      );
    } else {
      return <div>Please select a graph type and input column(s)</div>;
    }
  };

  return (
    <div>
      <h2>Select Graph Type:</h2>
      <select value={graphType} onChange={handleGraphTypeChange}>
        <option value="">Select...</option>
        <option value="lineChart">Line Chart</option>
        <option value="barChart">Bar Chart</option>
        <option value="pieChart">Pie Chart</option>
        <option value="histogram">Histogram</option>
        <option value="heatmap">Heatmap</option>
      </select>

      {graphType && (
        <div>
          <h2>Select Input Column(s):</h2>
          <select value={inputColumns} onChange={handleInputChange}>
            <option value="">Select...</option>
            {Object.keys(csvData[0]).map((column, index) => (
              <option key={index} value={column}>{column}</option>
            ))}
          </select>
        </div>
      )}

      {renderGraph()}
    </div>
  );
};

export default DataAnalyzer;
