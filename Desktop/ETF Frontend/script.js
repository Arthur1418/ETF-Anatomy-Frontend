document.addEventListener("DOMContentLoaded", function () {
  fetchMarketData();
  fetchPredictionData();
  fetchETFData("niftybees");  // Fetch the default ETF data immediately
  setInterval(() => fetchETFData("niftybees"), 60000);  // Refresh data every 60 seconds
});

function fetchMarketData() {
  axios
    .get("http://127.0.0.1:5000/etf/niftybees")
    .then((response) => {
      const marketData = response.data;
      document.querySelector("#sp500Value").textContent = marketData.sp500;
      document.querySelector("#nasdaqValue").textContent = marketData.nasdaq;
      document.querySelector("#vixValue").textContent = marketData.vix;
      document.querySelector("#lastUpdatedTime").textContent = marketData.lastUpdated;
    })
    .catch((error) => {
      console.error("Error fetching market data: ", error);
    });
}

function fetchPredictionData() {
  axios
    .get("http://127.0.0.1:5000/etf/niftybees")
    .then((response) => {
      updatePredictionChart(response.data);
    })
    .catch((error) => {
      console.error("Error fetching prediction data: ", error);
    });
}

function updatePredictionChart(predictionData) {
  const ctx = document.getElementById("backtestingChart").getContext("2d");
  new Chart(ctx, {
      type: "line",
      data: {
          labels: predictionData.labels,
          datasets: [
              {
                  label: "Predicted ETF Performance",
                  data: predictionData.data,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
              },
          ],
      },
      options: {
          responsive: true,
          scales: {
              x: { title: { display: true, text: "Time" } },
              y: { title: { display: true, text: "ETF Price" } },
          },
      },
  });
}

document.querySelectorAll(".etf-card").forEach((card) => {
  card.addEventListener("click", () => {
      const ticker = card.querySelector("h5").textContent.trim();
      fetchETFData(ticker);
  });
});

async function fetchETFData(etfTicker) {
  try {
      const response = await axios.get(`https://etf-backend-0sfx.onrender.com/etf/${etfTicker}`);
      const data = response.data;

      document.querySelector(".text-2xl.font-bold").textContent = `₹${data.price}`;
      document.querySelector(".text-xs").textContent = `${data.changePercent > 0 ? "+" : ""}${data.changePercent}%`;
      document.querySelector(".px-2.py-1").textContent = data.signal.toUpperCase();
      document.querySelector(".bg-green-500").style.width = `${data.confidence}%`;

      updateChart(data.chart);
  } catch (error) {
      console.error("Failed to fetch ETF data:", error);
  }
}

let chartInstance;
function updateChart(chartData) {
  const ctx = document.getElementById("priceChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
      type: "line",
      data: {
          labels: chartData.dates,
          datasets: [
              {
                  label: "Price",
                  data: chartData.prices,
                  borderColor: "#4f46e5",
                  backgroundColor: "rgba(79, 70, 229, 0.1)",
                  fill: true,
                  tension: 0.4,
              },
          ],
      },
      options: {
          responsive: true,
          scales: {
              x: { display: true },
              y: { display: true },
          },
      },
  });
}

// Load default ETF
fetchETFData("niftybees");

