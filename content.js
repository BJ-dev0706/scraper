console.log("Content script loaded.");

function scrapeProductData() {
    const products = [];
  
    document.querySelectorAll("._2FypS").forEach((item) => {
      const name = item.querySelector(".nXeOv")?.innerText || "N/A";
      const imageSrc = item.querySelector(".product-img")?.src || "";
  
      const priceContainer = item.querySelector(".U-S0j");
      let price = '';
      
      if (priceContainer) {
        const spans = priceContainer.querySelectorAll('span');
        spans.forEach((span) => {
          price += span.innerText.trim();
        });
      } else {
        price = "Price not found";
      }
  
      products.push({ name, imageSrc, price });
    });
  
    console.log("Scraped Products:", products);
    return products;
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "scrape") {
    const products = scrapeProductData();
    sendResponse({ products: products });
  }
});