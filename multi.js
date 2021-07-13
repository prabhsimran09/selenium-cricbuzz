require("chromedriver");
const fs = require("fs");

const wd = require('selenium-webdriver');
//const chrome = require('selenium-webdriver/chrome');
//const browser = new wd.Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().headless() ).build();
let browser = new wd.Builder().forBrowser("chrome").build();

let matchId = process.argv[2];
let innings = process.argv[3];
let batsmanUrls = [];
let bowlerUrls = [] ;
let careerData = [];
let playersAdded = 0 ;

async function getData(urls, i, totalPlayers){
   
  let browser = new wd.Builder().forBrowser("chrome").build();
  await browser.get(urls);
  await browser.wait(wd.until.elementLocated(wd.By.css("table")));
  let tables = await browser.findElements(wd.By.css("table"));
  for(let j=0;j< tables.length;j++)
  {
    let battingKeys = [];
    let bowlingKeys = [];
    let keyColumns = await tables[j].findElements(wd.By.css("thead th"));
    let data = {};
    for(let k =1; k< keyColumns.length;k++)
    {
      let title = await keyColumns[k].getAttribute("title");
      title = title.split(" ").join("");
      if(j == 0)
       { battingKeys.push(title); }
      else
      { bowlingKeys.push(title);  }
    }
    let dataRows = await tables[j].findElements(wd.By.css("tbody tr"));
    for(let y=0;y < dataRows.length; y++)
    {
      let tempData = {} ;
      let dataColumns = await dataRows[y].findElements(wd.By.css("td"));
      let matchType = await dataColumns[0].getAttribute("innerText");
      for(let k=1;k < dataColumns.length;k++)
      {

       tempData[ k==0? battingKeys[k-1] : bowlingKeys[k-1] ] = await dataColumns[k].getAttribute("innerText");
      }
      data[matchType] = tempData ;
    }
    careerData[i][j==0 ? "battingCareer" : "bowlingCareer"] = data ;
  }
   playersAdded += 1;
   if(playersAdded == totalPlayers)
     fs.writeFileSync("career.json", JSON.stringify(careerData));

   browser.close();
}
async function main()
{
    await browser.get("https://www.cricbuzz.com/live-cricket-scores/"+matchId);
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));

    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();

    await browser.wait(wd.until.elementLocated(wd.By.css("#innings_"+ innings +" .cb-col.cb-col-100.cb-ltst-wgt-hdr")));
    let tables = await browser.findElements(wd.By.css("#innings_"+ innings +" .cb-col.cb-col-100.cb-ltst-wgt-hdr"));  
   
    let Innings1BatsmanRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i=0; i< Innings1BatsmanRows.length; i++)
    {
      let col = await Innings1BatsmanRows[i].findElements(wd.By.css("div"));
      if( col.length == 7)
      {
        let url = await col[0].findElement(wd.By.css("a")).getAttribute("href");
        let playername = await col[0].getAttribute("innerText");
        careerData.push({"PlayerName": playername});
         batsmanUrls.push(url);
      }
     
    }

    let InningsBowlerrows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let k = 0;k < InningsBowlerrows.length; k++ )
    {
      let col = await InningsBowlerrows[k].findElements(wd.By.css("div"));
      if( col.length == 8)
      {
       let url = await col[0].findElement(wd.By.css("a")).getAttribute("href");
       let playerName = await col[0].getAttribute("innerText");
       careerData.push({"PlayerName" : playerName});
       bowlerUrls.push(url);
      }
     
    }
    let finalUrls = batsmanUrls.concat(bowlerUrls);
    for(let i=0;i < finalUrls.length;i++)
    {
      getData( finalUrls[i], i, finalUrls.length);
    }
   await  browser.close();
}

main();