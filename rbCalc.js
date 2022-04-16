const puppeteer = require('puppeteer'); 
const xlsx = require('xlsx'); 

// Lineup the data
(async () => {
    
    // Declare variables
    const dataArr = []; 
    let objToPush = {
        popularity: null,
        popularityChg: null,
        results: null,
        resultsChg: null,
        search: null
    }; 
    let count = 0; 
    let desiredPageCount = 400; 
    let rawData = null; 
       
    // Launch Chromium Browser
    const URL = 'https://redbubble.dabu.ro/redbubble-popular-tags'; 
    const browser = await puppeteer.launch( {headless: false });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });
    
    for (let i = 0; i < desiredPageCount; i++){ 
    // console.log('outer loop start'); 
        rawData = await page.$$('td');
        for (let j = 0; j < rawData.length; j++){
            // console.log('inner loop start'); 
            let dataPoint = rawData[j];
            const value = await page.evaluate(
                dataPoint => dataPoint.textContent, dataPoint
                )  
      
                if (count === 0){
                    objToPush.popularity = parseInt(value.slice(0,-1));
                    count++;   
                } else if (count === 1){
                    objToPush.popularityChg = value.slice(0,-1);
                    count++;  
                } else if (count === 2){
                    objToPush.results = parseInt(value);
                    count++; 
                } else if (count === 3){
                    objToPush.resultsChg = value.slice(0,-1);
                    count++; 
                } else if (count === 4){
                    objToPush.search = value; 
                    count = 0; 
                    dataArr.push(objToPush); 
                    objToPush = {
                        popularity: null,
                        popularityChg: null,
                        results: null,
                        resultsChg: null,
                        search: null
                    }
                } else {
                    console.log('logic error. count var out of bounds');
                }
            }    
        await page.click('#DataTables_Table_0_next', {clickCount: 1});

        // console.log('next page');  
        rawData = null; 
        }     
        
        // Close the browser, Export Data 
        await browser.close();
        // console.log(dataArr); 
        
        // Extract the Data
        const worksheet = xlsx.utils.json_to_sheet(dataArr); 
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1"); 
        
        // Process Data
        xlsx.utils.sheet_add_aoa(worksheet, [["Pop/Demand", "PopularityChg", "Res/Supply", "ResultsChg", "Search/Tag"]], { origin: "A1" }); 
        
        const currentDateStr1 = new Date().toDateString().slice(4,7);  
        const currentDateStr2 = new Date().toDateString().slice(11,15);  
        const currentDateStr3 = new Date().toDateString().slice(8,10);  
        const currentDate = currentDateStr3 + currentDateStr1 + currentDateStr2; 

        // Package & Release Data
        xlsx.writeFile(workbook, `${currentDate}_rbMarketAnalysis.xlsx`);
    })(); 

//// BREAK BREAK BREAK ////
//// BREAK BREAK BREAK ////

// const puppeteer = require('puppeteer'); 
// const xlsx = require('xlsx'); 

// // Lineup the data
// (async () => {
    
//     // Declare variables
//     const dataArr = []; 
//     let objToPush = {
//         popularity: null,
//         popularityChg: null,
//         results: null,
//         resultsChg: null,
//         search: null
//     }; 
//     let count = 0; 
//     let desiredPageCount = 3; 
//     let rawData = null; 
    
//     // Declare functions
//     const clickNextPage = async () => {
//         await page.click('#DataTables_Table_0_next', {clickCount: 1}); 
//     }

//     const sayHello = () => {
//         console.log('hello'); 
//     }
    
//     const getData = async () => {
//         console.log('getData start'); 
//         // await page.waitForNavigation({waitUntil: 'networkidle2'}); 
//         rawData = await page.$$('td');
//         console.log(`rawData: ${rawData}`); 
//         console.log('line 34'); 
        
//     //     console.log('I made it to line 28'); 
//         // for (let j = 0; j < rawData.length; j++){
//         //     console.log('inner loop start'); 
//         //     let dataPoint = rawData[j];
//         //     const value = await page.evaluate(
//         //         dataPoint => dataPoint.textContent, dataPoint
//         //         )  
//         //     if (count === 0){
//         //         objToPush.popularity = parseInt(value.slice(0,-1));
//         //         count++;   
//         //     } else if (count === 1){
//         //         objToPush.popularityChg = value.slice(0,-1);
//         //         count++;  
//         //     } else if (count === 2){
//         //         objToPush.results = parseInt(value);
//         //         count++; 
//         //     } else if (count === 3){
//         //         objToPush.resultsChg = value.slice(0,-1);
//         //         count++; 
//         //     } else if (count === 4){
//         //         objToPush.search = value; 
//         //         count = 0; 
//         //         dataArr.push(objToPush); 
//         //         objToPush = {
//         //             popularity: null,
//         //             popularityChg: null,
//         //             results: null,
//         //             resultsChg: null,
//         //             search: null
//         //         }
//         //     } else {
//         //         console.log('logic error. count var out of bounds');
//         //     }
//         // }   
//         // rawData = null;  
//     }
        
//         // Launch Chromium Browser
//         const URL = 'https://redbubble.dabu.ro/redbubble-popular-tags'; 
//         const browser = await puppeteer.launch( {headless: false });
//         const page = await browser.newPage();
//         await page.goto(URL, { waitUntil: 'networkidle2' });
        

//         sayHello(); 
//         // Program Start
//         getData();         
//         // for (let i = 0; i < desiredPageCount; i++){
//             // clickNextPage();
//         page.waitFor(5000); 
//         // getData();
//         // }    
//         // Close the browser, Export Data 
//         // await browser.close();
//         console.log(`dataArr: ${dataArr}`); 
        
//         // Extract the Data
//         const worksheet = xlsx.utils.json_to_sheet(dataArr); 
//         const workbook = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1"); 
        
//         // Process Data
//         xlsx.utils.sheet_add_aoa(worksheet, [["Pop/Demand", "PopularityChg", "Res/Supply", "ResultsChg", "Search/Tag"]], { origin: "A1" }); 
        
//         // Package & Release Data
//         xlsx.writeFile(workbook, 'rbMarketAnalysis.xlsx');
//     })(); 