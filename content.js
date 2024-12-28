console.log("Content script loaded.");

function scrapeProductData() {
  const cars = [];

  const car = {
    link: document.querySelector("a").href || " ",
    name: document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxtb.a6hzxt0.a6hzxt0")?.innerText || " ",
    model: extractCarDetails(document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxtb.a6hzxt0.a6hzxt0")?.innerText || " ").year,
    year: extractCarDetails(document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxtb.a6hzxt0.a6hzxt0")?.innerText || " ").model,
    make: extractCarDetails(document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxtb.a6hzxt0.a6hzxt0")?.innerText || " ").make,
    spec_variant: document.querySelector(".variant")?.innerText || " ",
    location: document.querySelector(".location")?.innerText || " ",
    region: document.querySelector(".region")?.innerText || " ",
    kms: document.querySelector(".kms")?.innerText || " ",
    kms_category: document.querySelector(".kms-category")?.innerText || " ",
    fuel_type: document.querySelector(".fuel-type")?.innerText || " ",
    transmission: document.querySelector(".transmission")?.innerText || " ",
    fourwd: document.querySelector(".fourwd")?.innerText || " ",
    price_type: document.querySelector(".price-type")?.innerText || " ",
    est_price: document.querySelector(".est-price")?.innerText || " ",
    number_plate: document.querySelector(".number-plate")?.innerText || " ",
    vin: document.querySelector(".vin")?.innerText || " ",
    ext_color: document.querySelector(".ext-color")?.innerText || " ",
    imp_history: document.querySelector(".imp-history")?.innerText || " ",
    listed_category: document.querySelector(".listed-category")?.innerText || " ",
    number_of_days_listed: document.querySelector(".days-listed")?.innerText || " ",
    dealer_name: document.querySelector(".iompba0.iompba3._1lalutrgu._1lalutrfo._1lalutrhi._1lalutro6._1lalutro7._1lalutro8._1lalutro9._1lalutroa._1lalutrob._1lalutr320")?.querySelectorAll("span")?.[2]?.innerText || " ",
    dealer_address: document.querySelector(".iompba0.iompba3._1lalutrgu._1lalutrfo._1lalutrhi._1lalutro6._1lalutro7._1lalutro8._1lalutro9._1lalutroa._1lalutrob._1lalutr320")?.innerText || " ",
    listed_price: document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxte.a6hzxt0.a6hzxt0")?.innerText || " "
  };
  cars.push(car);

  console.log("Scraped Cars:", cars);
  return cars;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "scrape") {
    const cars = scrapeProductData();
    sendResponse({ products: cars });
  }
});


function extractCarDetails(carName) {
  if (!carName) return { year: null, make: null, model: null };

  const yearPattern = /^\d{4}/; // Matches the year (4 digits at the start)
  const yearMatch = carName.match(yearPattern);
  const year = yearMatch ? yearMatch[0] : null;

  // Remove the year and split the remaining string
  const remainingDetails = year ? carName.replace(year, "").trim() : carName.trim();
  const parts = remainingDetails.split(" "); // Split by spaces

  // Assume the first part (or two parts) represent the make
  let make = null;
  let model = null;

  if (parts.length > 1) {
    make = parts[0]; // First word is often the make
    // Check for multi-word make (e.g., "Mercedes-Benz")
    if (parts[1].includes("-")) {
      make += " " + parts[1];
      model = parts.slice(2).join(" "); // Remaining part is car type
    } else {
      model = parts.slice(1).join(" "); // Remaining part is car type
    }
  } else {
    model = remainingDetails; // If only one part remains, it's the car type
  }

  return { year, make, model };
}
