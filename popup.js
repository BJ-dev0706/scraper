document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("scrape-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "scrape" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError);
            } else {
              console.log("Received response from content script:", response);
              if (response && response.products) {
                download(response.products)
              }
            }
          }
        );
      } else {
        console.error("No active tab found.");
      }
    });
  });
});

function download(products) {
  // Convert the products object to a JSON string
  const jsonContent = JSON.stringify(products, null, 2); // Pretty print with 2-space indentation
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'products.json'; // Name of the downloaded file
  
  // Append to the body, click to download, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(link.href);
}
