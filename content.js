var stats = [];

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse){
    if(message.txt == "page1"){
        findStats();
    }else if(message.txt == "fetch_data"){
       createGraphic(message.stat);
    }else if(message.txt == "find_stat"){
        var exist = false;
        var index;
        for(let i=0; i<stats[0].length; i++){
            if(stats[0][i].includes(message.stat)){
                exist=true;
                index =i;
                break;
            }
        }
        if(exist){
            createGraphic(stats[0][index], message.foundStats);
        }else{
            chrome.runtime.sendMessage({
                msg: "noStat" 
            }); 
        }
     }
}


async function getData(){
    const response = await fetch("https://raw.githubusercontent.com/Itam67/FastStats/main/stats.csv");
    const data_temp = await response.text();

    const table = data_temp.split('\n').slice(1);

    
    var cols = [];
    for(let i=0; i<table.length;i++){
        cols.push([]);
    }

    table.forEach(row => {
        const columns = row.split(',');
        for(let i=0; i<table.length;i++){
            if(columns[i]==null){
                cols[i].push(0);
            }else{
                cols[i].push(columns[i]);  
            }   
        }
    });
    for(let i=0; i<cols[0].length;i++){
        cols[0][i] = cols[0][i].toLowerCase();
    }
    return Promise.resolve(cols);
}

async function findStats(){
    stats = await getData();

    var stat_list = stats[0]; //full list of all issues
    var foundStats= []; //Decleration of list that will contain all the found stats

    var documentHtml = document.documentElement.innerText;
    var occurences = [];
    for(let j = 0; j<stat_list.length; j++){
        var re = new RegExp(" "+stat_list[j].split(" ")[0].toLowerCase(), 'g');
        var occurence = (documentHtml.match(re) || []).length; // Searches the page for occurrences
        if(occurence!=0 && !foundStats.includes(stat_list[j])){
            foundStats.push(stat_list[j]);
            occurences[j] = occurence;
        }
    }

    occurences = occurences.filter(function(value){ 
        return !isNaN(value);
    });

    var finalized = [];
    var len = occurences.length;
    for(let i = 0; i<len; i++){
        var max_val = Math.max.apply(null, occurences);
        max_val_ind = occurences.indexOf(max_val);
        finalized.push(foundStats[max_val_ind]);
        occurences[max_val_ind]=0;
    }
    

    chrome.runtime.sendMessage({
        msg: "foundStats", 
        foundStats: {
           content: finalized
        }
    }); 
}

/*function highlightIssues(issue){
    const text = document.querySelectorAll('h1,h2,h3,h4,h5,li,p,td,caption,span,a');
    for(let i = 0; i<text.length; i++){
        if(text[i].innerHTML.toLowerCase().includes(issue)){
            text[i].innerHTML  = text[i].innerHTML.replace(new RegExp(issue, "gi"), (match) => `<mark id=highlighted>${match}</mark>`);
        }
    }

}*/

function removeHighlight(issue){
    
    if( document.getElementById('highlighted')!=null){
    }

}

function createGraphic(stat){
   // highlightIssues(issue);
   var data = [];
   for (let i=1;i< stats.length; i++){
       if(stats[i][stats[0].indexOf(stat)]!=0){
            data.push(stats[i][stats[0].indexOf(stat)]);
       }

   }
    chrome.runtime.sendMessage({
        msg: "stats", 
        stats: {
            content: data
        }
    }); 
}



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
    }
);

