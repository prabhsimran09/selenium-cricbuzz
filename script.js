require("chromedriver");

const wd = require('selenium-webdriver');
//const chrome = require('selenium-webdriver/chrome');
//const browser = new wd.Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().headless() ).build();
const browser = new wd.Builder().forBrowser("chrome").build();

let matchId = process.argv[2];
let innings = process.argv[3];
let batsmanScorecard = [];
let bowlerScorecard = [] ;
let batsmankeys = ["Playername","Out","Runs","Balls","Fours","Sixes","StrikeRate"];
let bowlerkeys = ["Playername","Overs","Maidenovers","Runs","Wickets","Noballs","Wideballs","Economy"]

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
        let data = [] ;
        for(let j=0; j < col.length; j++)
        {
          data[batsmankeys[j]] = await col[j].getAttribute("innerText");    
        }
        batsmanScorecard.push(data);
      }
    }
    console.log(batsmanScorecard);

    let InningsBowlerrows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let k = 0;k < InningsBowlerrows.length; k++ )
    {
       let col = await InningsBowlerrows[k].findElements(wd.By.css("div"));
       if( col.length == 8)
       {
         let data = [];
         for(let j=0; j<col.length;j++)
         {
            data[bowlerkeys[j]] = await col[j].getAttribute("innerText");
          }
         bowlerScorecard.push(data);
       }
    }
   console.log(bowlerScorecard);
   await (await browser).close();
}
   

main();
