

window.onload = function start(tab) {   
    let params = {
        active: true,
        currentWindow: true
    }
    chrome.tabs.query(params,gotTabs);
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "foundStats") {

            displayFoundStatsSetUp(request.foundStats.content);
        }else if(request.msg == "stats"){
            displayStats(request.stats, 0);
        }else if(request.msg == "noStat"){
            document.getElementById("foundStats").innerHTML = "No Stats Were Found :( <p>Please Reopen Extension</p>";
        }
    }
);

function serachStats(){
    var value = document.getElementById("input").value;
    if(value.split(" ")[0].length>3){
        let msg_2 = {
            txt: "find_stat",
            stat: value.split(" ")[0].toLowerCase()
        }
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { chrome.tabs.sendMessage(tabs[0].id, msg_2); });
    }else{
        document.getElementById("foundStats").innerHTML = "Invalid Search:( <p>Please Reopen Extension</p>";
    }
}

function displayFoundStats(statList, start,end, total_found){
    document.getElementById("foundStats").innerHTML ="Found Stats"; 
    document.getElementById("button").onclick = function(){serachStats()}; 
    for(let i=start; i<end; i++){
        var node = document.createElement("LI");
        node.type = "submit";
        node.style.textAlign = "center"; 
        node.style.listStyleType = "none"; 
        node.style.textDecoration = "none"; 
        node.style.fontWeight = 350;
        node.style.fontSize = 30; 
        node.id = i;

        node.onclick = function(){            
            let msg_1 = {
                txt: "fetch_data",
                stat: statList[this.id]
            }
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { chrome.tabs.sendMessage(tabs[0].id, msg_1); });
        
        }
        var textnode = document.createTextNode(statList[i].charAt(0).toUpperCase() + statList[i].slice(1));         
        node.appendChild(textnode);              
        document.getElementById("foundStats").appendChild(node);
        document.getElementById("totalStats").innerHTML = (end)+"/"+(total_found); 
        document.getElementById("totalStats").style.float = "right"; 
        document.getElementById("moreStats").onclick = function(){
            if(end==statList.length){
                displayFoundStatsSetUp(statList);
            }
            else if(end+10>statList.length){
                displayFoundStats(statList, end, statList.length, total_found);
            }else{
                displayFoundStats(statList, end, end+10,total_found);
            }
                
        }
        
    }
}

function displayFoundStatsSetUp(statList){
    if(statList.length==0){
        document.getElementById("foundStats").innerHTML ="No Stats Were Found";
        document.getElementById("button").onclick = function(){serachStats()}; 
    }else if(statList.length <= 10){ 
        displayFoundStats(statList,0, statList.length,statList.length); 
    }else{
        displayFoundStats(statList,0,10,statList.length); 
    }
}

function displayStats(stats, i){
    if(i>stats.content.length-1){
        i=0;
    }else if(i<0){
        i=stats.content.length-1;
    }
    
    if(document.getElementById("div1")!=null){
        var div  = document.getElementById("div1");
        div.parentNode.removeChild(div);
    }
        
    document.getElementById("foundStats").innerHTML = "<iframe src='" + stats.content[i] + "'loading='lazy' style='width: 100%; height: 500px; border: 0px none;'></iframe><span id='next' style='float:right'>Next</span><span id='i' style='float:center'></span><span id='back' style='float:left'>Back</span>";
    document.getElementById("next").style.fontSize = '25px';
    document.getElementById("next").style.fontWeight = 350;

    document.getElementById("back").style.fontSize = '25px';
    document.getElementById("back").style.fontWeight = 350;

    document.getElementById("i").innerHTML = (i+1)+"/"+stats.content.length;
    document.getElementById("i").style.fontSize = '25px';
    document.getElementById("i").style.fontWeight = 350;

    document.getElementById("next").onclick = function(){
        displayStats(stats, i+1);
    }
    document.getElementById("back").onclick = function(){
        displayStats(stats, i-1);
    }
}



function gotTabs(tabs){
    let msg = {
        txt: "page1"
    }
    chrome.tabs.sendMessage(tabs[0].id,msg);
}




 
     
