const puppeteer = require('puppeteer'); 
const xlsx = require('xlsx'); 


// Lineup the data
(async () => {
    const browser = await puppeteer.launch( {headless: false });
    const page = await browser.newPage();
    await page.goto('https://redbubble.dabu.ro/redbubble-popular-tags');
    
    const dataArr = []; 
    const rawData = await page.$$('td');
    let objToPush = {
        popularity: null,
        popularityChg: null,
        results: null,
        resultsChg: null,
        search: null
    }; 
    let count = 0; 
    for (let i = 0; i < 15; i++){
        let dataPoint = rawData[i];
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
            console.log(`count is: ${count}. Reset count`); 
            count = 0; 
            console.log(`count is reset to: ${count}`)

            dataArr.push(objToPush); 
            console.log(`dataArr: ${dataArr}`); 

            console.log('reset objToPush'); 
            objToPush = {
                popularity: null,
                popularityChg: null,
                results: null,
                resultsChg: null,
                search: null
            }
            console.log(`objToPush is reset to: ${objToPush}`); 
        } else {
            console.log('logic error. count var out of bounds');
        }
    }       
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

