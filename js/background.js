let db;
const DB_NAME = 'scrapedDataDB';
const STORE_NAME = 'scrapedProducts';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'link' });
        
        store.createIndex('make', 'make', { unique: false });
        store.createIndex('model', 'model', { unique: false });
        store.createIndex('year', 'year', { unique: false });
        store.createIndex('page_number', 'page_number', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database opened successfully');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
  });
}

async function storeScrapedData(products) {
  if (!db) {
    await openDatabase();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    let successCount = 0;
    
    products.forEach(product => {
      const request = store.put(product);
      
      request.onsuccess = () => {
        successCount++;
        if (successCount === products.length) {
          console.log(`Successfully stored ${successCount} products in the database`);
          resolve(successCount);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error storing product:', event.target.error);
      };
    });
    
    transaction.oncomplete = () => {
      console.log('Transaction completed');
    };
    
    transaction.onerror = (event) => {
      console.error('Transaction error:', event.target.error);
      reject(event.target.error);
    };
  });
}

async function getAllStoredData() {
  if (!db) {
    await openDatabase();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error('Error retrieving data:', event.target.error);
      reject(event.target.error);
    };
  });
}

openDatabase().catch(error => console.error('Failed to initialize database:', error));

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_progress") {
    chrome.runtime.sendMessage(request);
  } else if (request.action === "scrape") {
    console.log("Scraped Data received in background:", request.data);
    
    if (request.data && Array.isArray(request.data.products)) {
      storeScrapedData(request.data.products)
        .then(count => {
          console.log(`${count} products stored in the database`);
          sendResponse({ status: "Data stored in database", count });
        })
        .catch(error => {
          console.error('Error storing data:', error);
          sendResponse({ status: "Error storing data", error: error.message });
        });
      
      return true;
    }
    
    sendResponse({ status: "Data received in background script" });
  } else if (request.action === "get_all_data") {
    getAllStoredData()
      .then(data => {
        sendResponse({ status: "success", data });
      })
      .catch(error => {
        sendResponse({ status: "error", message: error.message });
      });
    
    return true;
  }
});
  