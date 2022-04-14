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
    let desiredPageCount = 3; 
    let rawData = null; 
    // Declare functions
    // const clickNextPage = async () => {
    //     const nextPageButton = await page.evaluate(() => {
    //         document.getElementById("#DataTables_Table_0_next")
    //     });
    //     nextPageButton.click({clickCount:2}); 
    // }
    
    // Launch Chromium Browser
    const URL = 'https://redbubble.dabu.ro/redbubble-popular-tags'; 
    const browser = await puppeteer.launch( {headless: false });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });
    
    // const nextButton = await page.$eval('#DataTables_Table_0_next', (el) => el);
    // await page.click('#DataTables_Table_0_next', {clickCount: 2});
    // await page.waitFor(5000); 
    console.log('before the for loop'); 
    // const getData = async () => {
    for (let i = 0; i < desiredPageCount; i++){ 
    console.log('outer loop start'); 
        rawData = await page.$$('td');
        for (let j = 0; j < 15; j++){
            console.log('inner loop start'); 
            let dataPoint = rawData[j];
            const value = await page.evaluate(
                dataPoint => dataPoint.textContent, dataPoint
                )  
                // console.log(`value\#${i}: ${value}`); 
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
        // await page.waitForNavigation({waitUntil: 'networkidle2'});
        console.log('next page');  
        rawData = null; 
        }     
        
        
        // Close the browser, Export Data 
        await browser.close();
        console.log(dataArr); 
        
        // Extract the Data
        const worksheet = xlsx.utils.json_to_sheet(dataArr); 
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1"); 
        
        // Process Data
        xlsx.utils.sheet_add_aoa(worksheet, [["Pop/Demand", "PopularityChg", "Res/Supply", "ResultsChg", "Search/Tag"]], { origin: "A1" }); 
        
        // Package & Release Data
        xlsx.writeFile(workbook, 'rbMarketAnalysis.xlsx');
    })(); 
    
    
    // for (let i = 0; i > desiredPageCount; i++){
        //     clickNextPage();
        //     console.log('next page'); 
        //     getData();
        // }    

        
        // }
        // getData();         