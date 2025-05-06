console.log("Content script loaded.");

const GetProducts = () => {
  const cars = [];
  const products = document.querySelectorAll(".iompba0.iompba3._1lalutr15c._listing-card_39o31_1._listing-card-is-wide_39o31_37");
  products.forEach(product => {
    const car = scrapeProductData(product);
    cars.push(car);
  });
  return cars;
}

const scrapeProductData = (product) => {
  const {year, make, model} = extract(product.querySelector("span.iompba0._1lalutrg6._1tlv1fe9o.a6hzxti.a6hzxt0.a6hzxt0")?.innerText || " ")

  const car = {
    link: product.querySelector('a[aria-label="View details"]')?.href || " ",
    name: product.querySelector("span.iompba0._1lalutrg6._1tlv1fe9o.a6hzxti.a6hzxt0.a6hzxt0")?.innerText || " ",
    year,
    make,
    model,
    spec_variant: product.querySelector("div.iompba0.iompba3._1lalutrfo.a6hzxt0").querySelector("span.iompba0._1lalutrg6.a6hzxt3.a6hzxt0.a6hzxt0")?.innerText || " ",
    location: product.querySelector("div[data-testid='seller-section']")?.querySelector("div.iompba0.iompba3._1lalutrh0._1lalutrfu._1lalutrho._1lalutrp6._1lalutr32c")?.querySelector("span.iompba0._1lalutrg6.a6hzxt3.a6hzxt0.a6hzxt0")?.innerText || " ",
    region: "AU",
    kms: product.querySelectorAll("div.iompba0.iompba3._1lalutrh0._1lalutrfu._1lalutrho._1lalutrr0._1lalutr32c")[3].querySelector("span.iompba0._1lalutrg6._1tlv1fe6c.a6hzxt3.a6hzxt0.a6hzxt0")?.innerText || " ",
    fuel_type: product.querySelectorAll("div.iompba0.iompba3._1lalutrh0._1lalutrfu._1lalutrho._1lalutrr0._1lalutr32c")[2].querySelector("span.iompba0._1lalutrg6._1tlv1fe6c.a6hzxt3.a6hzxt0.a6hzxt0")?.innerText || " ",
    transmission: product.querySelectorAll("div.iompba0.iompba3._1lalutrh0._1lalutrfu._1lalutrho._1lalutrr0._1lalutr32c")[1].querySelector("span.iompba0._1lalutrg6._1tlv1fe6c.a6hzxt3.a6hzxt0.a6hzxt0")?.innerText || " ",
    fourwd: product.querySelector(".fourwd")?.innerText || "Not indicated",
    price_type: product.querySelector("div.iompba0.iompba3._1lalutrfu._1lalutri0._1lalutrou._1lalutr32c")?.querySelector("span.iompba0._1lalutrg6.a6hzxta.a6hzxt0.a6hzxt0").innerText || " ",
    est_price: product.querySelector("div.iompba0.iompba3._1lalutrfu._1lalutri0._1lalutrou._1lalutr32c")?.querySelector("a.iompba0.iompba4._1lalutrg6.a6hzxta.a6hzxt0._1vzaghk4._1vzaghk5._1vzaghke").innerText || " ",
    price: product.querySelector("div.iompba0.iompba3._1lalutrfu._1lalutri0._1lalutrou._1lalutr32c")?.querySelector("div.iompba0.iompba3._1lalutrfo._1lalutr150.a6hzxt0")?.querySelector("span.iompba0._1lalutrg6._1tlv1fe9o.a6hzxtk.a6hzxt0.a6hzxt0").innerText || " ",
    number_plate: product.querySelector(".number-plate")?.innerText || "Not indicated",
    vin: product.querySelector(".vin")?.innerText || "Not indicated",
    ext_color: product.querySelector(".ext-color")?.innerText || "Not mentioned",
    imp_history: product.querySelector(".imp-history")?.innerText || "Not explicitly stated",
    listed_category: product.querySelector(".listed-category")?.innerText || "Not mentioned",
    number_of_days_listed: product.querySelector(".days-listed")?.innerText || "Not shown",
    dealer_name: product.querySelector(".iompba0.iompba3._1lalutrgu._1lalutrfo._1lalutrhi._1lalutro6._1lalutro7._1lalutro8._1lalutro9._1lalutroa._1lalutrob._1lalutr320")?.querySelectorAll("span")?.[2]?.innerText || "Not shown",
    dealer_address: product.querySelector("div[data-testid='seller-section']")?.querySelector("div.iompba0.iompba3._1lalutrh0._1lalutrfu._1lalutrho._1lalutrp6._1lalutr32c")?.querySelector("span.iompba0._1lalutrg6.a6hzxt3.a6hzxt0.a6hzxt0")?.innerText || " ",
    listed_price: product.querySelector(".iompba0._1lalutrg0._1tlv1fe6n.a6hzxte.a6hzxt0.a6hzxt0")?.innerText || "Not shown"
  };
  return car;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "scrape") {
    const cars = GetProducts();
    console.log(cars);
    sendResponse({ products: cars });
  }
});

const knownMakes = [
  "Kia", "Chevrolet", "BMW", "Toyota", "Hyundai", "Mitsubishi", "LDV", "Tesla",
  "Land Rover", "Volkswagen", "GWM", "Ford", "Subaru", "Chery", "Porsche", "Nissan",
  "Holden"
];

const extract = (car) => {
  const words = car.split(" ");
  const year = words[0];
  const remaining = words.slice(1);

  let make = "";
  let makeEndIndex = 0;

  for (let i = 1; i <= 2; i++) {
    const candidate = remaining.slice(0, i).join(" ");
    if (knownMakes.includes(candidate)) {
      make = candidate;
      makeEndIndex = i;
    }
  }

  const model = remaining.slice(makeEndIndex).join(" ");

  return { year, make, model };
}