function downloadAsExcel(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Scraped Data");

  const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(excelFile)], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "scraped_data.xlsx";
  link.click();

  URL.revokeObjectURL(url);
}

function s2ab(s) {
  const buffer = new ArrayBuffer(s.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buffer;
}

function updateStatus(message) {
  const statusElement = document.getElementById("status");
  statusElement.textContent = message;
}

function updateProgress(currentPage, totalProducts) {
  const progressElement = document.querySelector(".progress");
  const currentPageElement = document.getElementById("current-page");
  const totalProductsElement = document.getElementById("total-products");
  
  progressElement.style.display = "block";
  currentPageElement.textContent = currentPage;
  totalProductsElement.textContent = totalProducts;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_progress") {
    updateProgress(request.data.currentPage, request.data.totalCars);
    updateStatus(`Scraping page ${request.data.currentPage}. Found ${request.data.totalCars} products so far...`);
  }
});

document.getElementById("scrape-btn").addEventListener("click", () => {
  const maxPages = parseInt(document.getElementById("max-pages").value, 10);
  
  if (isNaN(maxPages) || maxPages < 1) {
    updateStatus("Please enter a valid number of pages to scrape (minimum 1).");
    return;
  }
  
  const scrapeButton = document.getElementById("scrape-btn");
  scrapeButton.disabled = true;
  scrapeButton.textContent = "Scraping...";
  
  updateProgress(0, 0);
  updateStatus("Starting scraping process...");
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scrape", maxPages: maxPages }, (response) => {
      if (response && response.products) {
        console.log("Scraped Products:", response.products);
        updateStatus(`Scraping complete! Downloaded ${response.products.length} products from ${maxPages} pages.`);
        downloadAsExcel(response.products);
      } else {
        updateStatus("Error: No response or products received.");
        console.error("No response or products received.");
      }
      
      scrapeButton.disabled = false;
      scrapeButton.textContent = "Start Scraping";
    });
  });
});
