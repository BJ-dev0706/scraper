function downloadAsExcel(data) {
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Scraped Data");

  // Write the workbook and trigger a download
  const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(excelFile)], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "scraped_data.xlsx";
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}

// Helper function to convert a string to an ArrayBuffer
function s2ab(s) {
  const buffer = new ArrayBuffer(s.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buffer;
}

document.getElementById("scrape-btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "scrape" }, (response) => {
      if (response && response.products) {
        console.log("Scraped Products:", response.products);

        downloadAsExcel(response.products);
      } else {
        console.error("No response or products received.");
      }
    });
  });
});
