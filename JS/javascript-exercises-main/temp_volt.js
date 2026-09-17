import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";



const firebaseConfig = {
    apiKey: "AIzaSyCj3Ce3xkK-NwftMGz10Q90PLCrR2NsRsI",
    authDomain: "node-red-demo-d13ff.firebaseapp.com",
    databaseURL: "https://node-red-demo-d13ff-default-rtdb.firebaseio.com",
    projectId: "node-red-demo-d13ff",
    storageBucket: "node-red-demo-d13ff.firebasestorage.app",
    messagingSenderId: "824136624367",
    appId: "1:824136624367:web:4b4ccc20d101c4ee7dd31a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const myDataRef = ref(db, 'data');


let temperature = [];
let voltage = [];
let timestamps = [];

onValue(myDataRef, (snapshot) => {
    const data = snapshot.val();
    const temp = data?.temperature || {};
    const volt = data?.voltage || {};
    temperature = Object.values(temp);
    voltage = Object.values(volt);
    timestamps = Object.keys(temp)

    drawLiveChart(svg4)

    drawAvgChart(avg_temperature, temperature)

    drawAvgChart(avg_voltage, voltage)

}, (error) => {
    console.error("Error reading data:", error);
});


const svg4= document.getElementById("svg4")
const avg_temperature = document.getElementById("avg_temperature")
const avg_voltage = document.getElementById("avg_voltage")


function drawLiveChart(svg){

    svg.innerHTML = '';

    const currTimestmaps = timestamps.slice(-50)
    const currTemperature = temperature.slice(-50)
    const currVoltage = voltage.slice(-50)
    for(let i=0;i<=12;i++){
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i ), x2: 40, y2: 20 + 30 * (i )});
        drawText(svg, {x: 20, y: 25 + 30 * (i ), text: 46-i});
    }

    for(let i=1;i<=currTimestmaps.length;i++){
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});
        drawText(svg, {x: 40 + 30 * i, y: 400, text: currTimestmaps[i-1],vertical:true});
    }

    drawLine(svg, {x1: 40, y1: 380, x2: 1440, y2: 380});

    drawLine(svg, {x1: 40, y1: 20, x2: 40, y2: 380});

    let prevTempX = null, prevTempY = null;
    let prevVoltX = null, prevVoltY = null;

    for(let i=1;i<=currTimestmaps.length;i++){

        if(prevTempX!==null){
            drawLine(svg , {x1:prevTempX , y1:prevTempY , x2:40 + 30*(i) , y2:380-((currTemperature[i-1]-34)*30) , stroke:'lightgreen' , strokeType:'solid'})
        }
        prevTempX =40 + 30*(i)
        prevTempY = 380-((currTemperature[i-1]-34)*30)
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((currTemperature[i-1]-34)*30), r: 2, fill: 'green'});

        if(prevVoltX!==null){
            drawLine(svg , {x1:prevVoltX , y1:prevVoltY , x2:40 + 30*(i) , y2:380-((currVoltage[i-1]-34)*30) , stroke:'lightblue' , strokeType:'solid'})
        }
        prevVoltX =40 + 30*(i)
        prevVoltY = 380-((currVoltage[i-1]-34)*30)
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((currVoltage[i-1]-34)*30), r: 2, fill: 'blue'});

    }

}

function getAverage(arr){
    let currRange = Number(timestamps[0]) + 180000
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
    return avgArray
}

function drawAvgChart(svg , arr){
    svg.innerHTML = ''

    let currAvgArray = getAverage(arr)
    let avgArray = currAvgArray.slice(-50)
    for(let i=0;i<=12;i++){
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i ), x2: 40, y2: 20 + 30 * (i )});
        drawText(svg, {x: 20, y: 25 + 30 * (i ), text: 46-i});
    }

    for(let i=1;i<=avgArray.length;i++){
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});
        drawText(svg, {x: 40 + 30 * i, y: 400, text: i});
    }

    drawLine(svg, {x1: 40, y1: 380, x2: 1440, y2: 380});

    drawLine(svg, {x1: 40, y1: 10, x2: 40, y2: 380});

    for(let i=1;i<=avgArray.length;i++){
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((avgArray[i-1]-34)*30), r: 2, fill: 'green'});
    }

}

// async function fetchData() {
//     try {
//         const res = await fetch(DATABASE_URL);
//         const data = await res.json();
//         const temp = data?.temperature || {};
//         const volt = data?.voltage || {};
//         temperature = Object.values(temp);
//         voltage = Object.values(volt);
//         timestamps = Object.keys(temp)
//
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// }
//
// await fetchData();

