document.addEventListener("DOMContentLoaded", function () {
    const marketTabs = document.querySelectorAll(".market-tab");
    const indianEtfsSection = document.getElementById("indianEtfsSection");
    const usEtfsSection = document.getElementById("usEtfsSection");
    const globalEtfsSection = document.getElementById("globalEtfsSection");
  
    const backendURL = "https://etf-backend-0sfx.onrender.com/api/etf";
  
    marketTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        marketTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
  
        const market = tab.getAttribute("data-market");
        if (market === "india") {
          indianEtfsSection.classList.remove("hidden");
          usEtfsSection.classList.add("hidden");
          globalEtfsSection.classList.add("hidden");
        } else if (market === "us") {
          indianEtfsSection.classList.add("hidden");
          usEtfsSection.classList.remove("hidden");
          globalEtfsSection.classList.add("hidden");
        } else if (market === "global") {
          indianEtfsSection.classList.add("hidden");
          usEtfsSection.classList.add("hidden");
          globalEtfsSection.classList.remove("hidden");
        }
      });
    });
  
    function fetchEtfData(market) {
      axios
        .get(`${backendURL}/${market}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching ETF data:", error);
        });
    }
  
    fetchEtfData("india");
  });
  