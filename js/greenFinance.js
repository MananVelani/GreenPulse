// Get the form and result elements
const form = document.getElementById('cost-breakeven-form');
const resultElement = document.getElementById('cost-breakeven-result');
const chartContainer = document.getElementById('piechart_3d');
const investmentAmountSlider = document.getElementById('investment-amount');
const investmentAmountValueElement = document.getElementById('investment-amount-value');
const timeSlider = document.getElementById('time');
const timeValueElement = document.getElementById('time-value');

// Update the investment amount value display when the slider changes
investmentAmountSlider.addEventListener('input', () => {
  investmentAmountValueElement.textContent = `₹${investmentAmountSlider.value}`;
});

// Update the time value display when the slider changes
timeSlider.addEventListener('input', () => {
  timeValueElement.textContent = `${timeSlider.value} years`;
});

// Define the variables and assumptions
const sellingPricePerUnit = 7; // ₹7 per unit of electricity sold
const costPerKW = 40000; // ₹40,000 per kW of solar panel
const unitsPerKWPerYear = 1200; // assume 1200 units per kW per year
const discountPercentage = 0.10; // 10% discount on the total cost
const efficiencyDecreasePercentage = 0.005; // 0.5% decrease in efficiency per year

// Add an event listener to the form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const investmentAmount = parseInt(investmentAmountSlider.value);
  const time = parseInt(timeSlider.value);
  const minAmountRequired = costPerKW * (1 - discountPercentage); // minimum amount required to purchase at least one solar panel
  if (investmentAmount >= minAmountRequired) {
    calculateCostBreakeven(investmentAmount, time);
  } else {
    resultElement.textContent = `You need to invest at least ₹${minAmountRequired.toFixed(2)} to purchase at least one solar panel.`;
  }
});

// Calculate the cost breakeven
function calculateCostBreakeven(investmentAmount, time) {
  const discountedCostPerKW = costPerKW * (1 - discountPercentage); // apply 10% discount
  const kWInstalled = investmentAmount / discountedCostPerKW; // calculate the kW installed based on the investment amount
  let totalUnitsGenerated = 0;
  
  let efficiency = 1; // initial efficiency
  let totalEarnings = 0; // total earnings

  for (let year = 0; year < time; year++) {
    for (let month = 0; month < 12; month++) {
      const unitsGeneratedThisMonth = kWInstalled * unitsPerKWPerYear / 12 * efficiency; // units generated this month
      totalUnitsGenerated += unitsGeneratedThisMonth;
      totalEarnings += unitsGeneratedThisMonth * sellingPricePerUnit; // add earnings for this month
      efficiency *= (1 - efficiencyDecreasePercentage); // decrease efficiency by 0.5% each year
    }
  }

  const profit = totalEarnings - investmentAmount; // calculate profit

  resultElement.innerText = `After ${time} Years,\n Total Earnings: ₹${totalEarnings.toLocaleString('en-IN')} \n Profit: ₹${profit.toLocaleString('en-IN')}.`;

  // Call drawPieChart function with investmentAmount and profit
  drawPieChart(investmentAmount, profit);
}

// Draw chart function
function drawPieChart(investmentAmount, profit) {
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(drawVisualization);
  
  function drawVisualization() {
    var data = google.visualization.arrayToDataTable([
      ['Category', 'Amount'],
      ['Investment Amount', investmentAmount],
      ['Profit', profit]
    ]);

    var options = {
      title: 'Investment vs Profit',
      is3D: true,
    };

    // Clear the chart container
    chartContainer.innerHTML = '';

    var chart = new google.visualization.PieChart(chartContainer);
    chart.draw(data, options);
  }
}