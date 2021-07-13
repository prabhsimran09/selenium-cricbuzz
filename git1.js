require("chromedriver");
const fs = require("fs");


const wd = require('selenium-webdriver');
let browser = new wd.Builder().forBrowser("chrome").build();

let projectsadded = 0;
let n = 0;
let topicsData = [] ;

async function getIssues(url,i,j)
{

  let browser = new wd.Builder().forBrowser('chrome').build();
  let iurl = await browser.get(url+"/issues"); 
  if( browser.getCurrentUrl != iurl)
  {
    let issuebox = await  browser.findElements(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"));
    topicsData[i].Projects[j]["Issues"] = [];
    for(let a = 0; a < issuebox.length;a++){
      if(a == 2)
        { break; }

      let heading = await issuebox[a].getAttribute("innerText");
      let hurl = await issuebox[a].getAttribute("href");
      topicsData[i].Projects[j].Issues.push({ "Heading" : heading, "Url" : hurl});  
    }

    projectsadded +=1;
    if(projectsadded == n)
    {
     fs.writeFileSync("project.json", JSON.stringify(topicsData));
    }
  }
    browser.close();

}

async function getProjects(url,i)
{

  let browser = new wd.Builder().forBrowser('chrome').build();
  await browser.get(url); 

  let project = await browser.findElements(wd.By.css("a.text-bold"));
 
  n = (project.length > 2 ) ?  2 : project.length;
  let purl = [];
  topicsData[i]["Projects"] = [];

  for(let k=0;k<n;k++){
     let urll =  await project[k].getAttribute("href");
     purl.push(urll);
     topicsData[i].Projects.push({ ProjectUrl : urll});
    }
  for(let b = 0; b< topicsData[i].Projects.length ; b++) {
    getIssues(purl[b],i,b)
  }
  browser.close();
}

async function main()
{
  await browser.get("https://github.com/topics");
  await browser.wait(wd.until.elementLocated(wd.By.css(".col-12.col-sm-6.col-md-4.mb-4")));
  let box = await browser.findElements(wd.By.css(".col-12.col-sm-6.col-md-4.mb-4"));

  for(let i=0;i <box.length;i++){
     let url = await box[i].findElement(wd.By.css("a")).getAttribute("href");
     topicsData.push({"TopicUrl" : url});
    
  }

  for(let j=0;j < topicsData.length;j++){
      getProjects(topicsData[j].TopicUrl,j);
  }
  browser.close();
 
}
main()