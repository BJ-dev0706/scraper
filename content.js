console.log("Content script loaded.");

function scrapeProductData() {
  const cars = [];

  // Example: Find elements with class "car-item" and scrape details.
  document.querySelectorAll(".car-item").forEach((carElement) => {
    const car = {
      link: carElement.querySelector("a").href || "",
      name: carElement.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxtb.a6hzxt0.a6hzxt0")?.innerText || "",
      model: carElement.querySelector(".model")?.innerText || "",
      year: carElement.querySelector(".year")?.innerText || "",
      make: carElement.querySelector(".make")?.innerText || "",
      spec_variant: carElement.querySelector(".variant")?.innerText || "",
      location: carElement.querySelector(".location")?.innerText || "",
      region: carElement.querySelector(".region")?.innerText || "",
      kms: carElement.querySelector(".kms")?.innerText || "",
      kms_category: carElement.querySelector(".kms-category")?.innerText || "",
      fuel_type: carElement.querySelector(".fuel-type")?.innerText || "",
      transmission: carElement.querySelector(".transmission")?.innerText || "",
      fourwd: carElement.querySelector(".fourwd")?.innerText || "",
      price_type: carElement.querySelector(".price-type")?.innerText || "",
      est_price: carElement.querySelector(".est-price")?.innerText || "",
      number_plate: carElement.querySelector(".number-plate")?.innerText || "",
      vin: carElement.querySelector(".vin")?.innerText || "",
      ext_color: carElement.querySelector(".ext-color")?.innerText || "",
      imp_history: carElement.querySelector(".imp-history")?.innerText || "",
      listed_category: carElement.querySelector(".listed-category")?.innerText || "",
      number_of_days_listed: carElement.querySelector(".days-listed")?.innerText || "",
      dealer_name: carElement.querySelector(".dealer-name")?.innerText || "",
      dealer_address: carElement.querySelector(".iompba0.iompba3._1lalutrgu._1lalutrfo._1lalutrhi._1lalutro6._1lalutro7._1lalutro8._1lalutro9._1lalutroa._1lalutrob._1lalutr320")?.innerText || "",
      listed_price: carElement.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxte.a6hzxt0.a6hzxt0")?.innerText || ""
    };
    cars.push(car);
  });

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
