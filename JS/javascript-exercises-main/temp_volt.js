const DATABASE_URL = "https://node-red-demo-d13ff-default-rtdb.firebaseio.com/data.json"


let temperature = [];
let voltage = [];
let timestamps = [];


async function fetchData() {
    try {
        const res = await fetch(DATABASE_URL);
        const data = await res.json();
        const temp = data?.temperature || {};
        const volt = data?.voltage || {};
        temperature = Object.values(temp);
        voltage = Object.values(volt);
        timestamps = Object.keys(temp)

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

await fetchData();


const svg4= document.getElementById("svg4")
const avg_temperature = document.getElementById("avg_temperature")
const avg_voltage = document.getElementById("avg_voltage")

function getAverage(arr){
    let currRange = Number(timestamps[0]) + 180000
    console.log(Number(timestamps[0]))
    let avgArray = []
    let sum = arr[0]
    let cnt = 1
    for(let i=1;i<arr.length;i++){
        if(Number(timestamps[i])<=currRange){
            sum += arr[i]
            cnt++
        }else{
            avgArray.push(sum/cnt)
            sum = arr[i]
            cnt = 1
            currRange = Number(timestamps[i]) + 180000
        }
    }
    avgArray.push(sum/cnt)
    console.log(avgArray)
    return avgArray
}

function drawLiveChart(svg){
    for(let i=0;i<=12;i++){
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i ), x2: 40, y2: 20 + 30 * (i )});
        drawText(svg, {x: 20, y: 25 + 30 * (i ), text: 46-i});
    }

    for(let i=1;i<=timestamps.length;i++){
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});
        drawText(svg, {x: 40 + 30 * i, y: 400, text: timestamps[i-1],vertical:true});
    }

    drawLine(svg, {x1: 40, y1: 380, x2: 1440, y2: 380});

    drawLine(svg, {x1: 40, y1: 20, x2: 40, y2: 380});


    for(let i=1;i<=timestamps.length;i++){
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((temperature[i-1]-34)*30), r: 2, fill: 'green'});
    }

    for(let i=1;i<=timestamps.length;i++){
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((voltage[i-1]-34)*30), r: 2, fill: 'blue'});
    }
}

function drawAvgChart(svg , arr){
    let avgArray = getAverage(arr)
    for(let i=0;i<=12;i++){
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i ), x2: 40, y2: 20 + 30 * (i )});
        drawText(svg, {x: 20, y: 25 + 30 * (i ), text: 46-i});
    }

    for(let i=1;i<=avgArray.length;i++){
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});
        drawText(svg, {x: 40 + 30 * i, y: 400, text: i});
    }

    drawLine(svg, {x1: 40, y1: 380, x2: 550, y2: 380});

    drawLine(svg, {x1: 40, y1: 10, x2: 40, y2: 380});

    for(let i=1;i<=avgArray.length;i++){
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((avgArray[i-1]-34)*30), r: 2, fill: 'green'});
    }

}

drawLiveChart(svg4)

drawAvgChart(avg_temperature, temperature)

drawAvgChart(avg_voltage, voltage)

