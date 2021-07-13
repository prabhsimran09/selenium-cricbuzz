require("chromedriver");
const fs = require("fs");

const wd = require('selenium-webdriver');
let browser =  new wd.Builder().forBrowser("chrome").build();

team = [];

async function main()
{
  
  await browser.get("https://www.cricbuzz.com/cricket-series/3130/indian-premier-league-2020/squads");
  
  await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-col.cb-col-100.cb-series-brdr.cb-stats-lft-ancr.cb-stats-lft-tab")));
  
 
  let teamBox = await browser.findElements(wd.By.css(".cb-col.cb-col-100.cb-series-brdr.cb-stats-lft-ancr.cb-stats-lft-tab"));
  
  teamBox.push(await browser.findElement(wd.By.css(".cb-col.cb-col-100.cb-series-brdr.cb-stats-lft-ancr.cb-stats-lft-tab-active")));
  team.push({"TeamnName" : await teamBox[0].getAttribute("innerText")});
  
  let playerUrl = [] ;

  for(let i =1; i< teamBox.length;i++){
     team.push({"TeamName" : await teamBox[i].getAttribute("innerText")});
    } 
   console.log(team);
  for( let k = 0 ; k< teamBox.length; k++){

     await teamBox[k].click();
     await browser.wait(wd.until.elementLocated(wd.By.css(".cb-col.cb-col-50")));
     let playerBox = await browser.findElements(wd.By.css(".cb-col.cb-col-50"));
     team[k]["Players"] = [] ;
     for(let j = 0; j<playerBox.length; j++){
        let url = await playerBox[j].getAttribute("href");
        playerUrl.push(url);
       //await browser.get(purl);
      }  
      console.log(playerUrl); 
     //for(let k = 0; k< playerUrl.length; k++){
        //await browser.get(playerUrl);}*/
  
   }
  
 
  await  browser.close();

}

main();