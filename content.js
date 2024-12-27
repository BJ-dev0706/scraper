console.log("Content script loaded.");

function scrapeProductData() {
  const cars = [];

  const car = {
    link: document.querySelector("a").href || "",
    name: document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxtb.a6hzxt0.a6hzxt0")?.innerText || "",
    model: document.querySelector(".model")?.innerText || "",
    year: document.querySelector(".year")?.innerText || "",
    make: document.querySelector(".make")?.innerText || "",
    spec_variant: document.querySelector(".variant")?.innerText || "",
    location: document.querySelector(".location")?.innerText || "",
    region: document.querySelector(".region")?.innerText || "",
    kms: document.querySelector(".kms")?.innerText || "",
    kms_category: document.querySelector(".kms-category")?.innerText || "",
    fuel_type: document.querySelector(".fuel-type")?.innerText || "",
    transmission: document.querySelector(".transmission")?.innerText || "",
    fourwd: document.querySelector(".fourwd")?.innerText || "",
    price_type: document.querySelector(".price-type")?.innerText || "",
    est_price: document.querySelector(".est-price")?.innerText || "",
    number_plate: document.querySelector(".number-plate")?.innerText || "",
    vin: document.querySelector(".vin")?.innerText || "",
    ext_color: document.querySelector(".ext-color")?.innerText || "",
    imp_history: document.querySelector(".imp-history")?.innerText || "",
    listed_category: document.querySelector(".listed-category")?.innerText || "",
    number_of_days_listed: document.querySelector(".days-listed")?.innerText || "",
    dealer_name: document.querySelector(".dealer-name")?.innerText || "",
    dealer_address: document.querySelector(".iompba0.iompba3._1lalutrgu._1lalutrfo._1lalutrhi._1lalutro6._1lalutro7._1lalutro8._1lalutro9._1lalutroa._1lalutrob._1lalutr320")?.innerText || "",
    listed_price: document.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxte.a6hzxt0.a6hzxt0")?.innerText || ""
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
