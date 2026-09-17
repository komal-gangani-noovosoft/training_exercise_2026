import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";


//region Variable declaration

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
const tempRef = ref(db, 'data/temperature');
const voltRef = ref(db, 'data/voltage')

const svg4= document.getElementById("svg4")
const avg_temperature = document.getElementById("avg_temperature")
const avg_voltage = document.getElementById("avg_voltage")
let temperature = []
let voltage = []
let timestamps = []
let avgTempArray = null , avgVoltArray = null

let currentTempStart = null , currentTempCount=0 ,currentTempSum = 0
let currentVoltStart = null , currentVoltCount = 0, currentVoltSum =0
//endregion

//region Data fetching
onValue(tempRef, (snapshot) => {
    const data = snapshot.val();
    temperature = Object.values(data)
    timestamps = Object.keys(data)
    let newVal = temperature.at(-1)
    let newTimestamp = timestamps.at(-1)
    if(avgTempArray===null){
        avgTempArray=getAverage(temperature)
    }
    if(currentTempStart === null){
        currentTempStart = newTimestamp
    }

    if(newTimestamp - currentTempStart >= 180000){
        avgTempArray.push(currentTempSum/currentTempCount)
        currentTempStart = newTimestamp
        currentTempSum = 0
        currentTempCount = 0
    }
    currentTempSum += newVal
    currentTempCount++
    drawLiveChart(svg4)
    drawAvgChart(avg_temperature , avgTempArray.slice(-40))
}, (error) => {

    console.error("Error reading data:", error);
});


onValue(voltRef, (snapshot) => {
    const data = snapshot.val();
    voltage = Object.values(data)
    let newVal = voltage.at(-1)
    let newTimestamp = Object.keys(data).at(-1)
    if(avgVoltArray===null){
        avgVoltArray=getAverage(voltage)
    }
    if(currentVoltStart === null){
        currentVoltStart = newTimestamp
    }

    if(newTimestamp - currentVoltStart >= 180000){
        avgVoltArray.push(currentVoltSum/currentVoltCount)
        currentVoltStart = newTimestamp
        currentVoltSum = 0
        currentVoltCount = 0
    }
    currentVoltSum += newVal
    currentVoltCount++
    drawLiveChart(svg4)
    drawAvgChart(avg_voltage , avgVoltArray.slice(-40))
}, (error) => {
    console.error("Error reading data:", error);
});
//endregion

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


function staticChart(svg) {
    svg.innerHTML = '';

    for(let i=0; i<=12; i++){
        drawLine(svg, {x1: 36, y1: 20 + 30 * i, x2: 40, y2: 20 + 30 * i});
        drawText(svg, {x: 20, y: 25 + 30 * i, text: 46 - i});
    }

    drawLine(svg, {x1: 40, y1: 380, x2: 1440, y2: 380});
    drawLine(svg, {x1: 40, y1: 10,  x2: 40,   y2: 380});

}


function drawLiveChart(svg){

    const dynamic =  document.querySelectorAll('.dynamic')
    dynamic.forEach(ele => ele.remove() )

    const currTimestmaps = timestamps.slice(-40)
    const currTemperature = temperature.slice(-40)
    const currVoltage = voltage.slice(-40)


    for(let i=1;i<=currTimestmaps.length;i++){
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384, className:'dynamic'});
        drawText(svg, {x: 40 + 30 * i, y: 400, text: currTimestmaps[i-1],vertical:true, className:'dynamic'});
    }

    let prevTempX = null, prevTempY = null;
    let prevVoltX = null, prevVoltY = null;

    for(let i=1;i<=currTimestmaps.length;i++){

        if(prevTempX!==null){
            drawLine(svg , {x1:prevTempX , y1:prevTempY , x2:40 + 30*(i) , y2:380-((currTemperature[i-1]-34)*30) , stroke:'lightgreen' , strokeType:'solid', className:'dynamic'})
        }
        prevTempX =40 + 30*(i)
        prevTempY = 380-((currTemperature[i-1]-34)*30)
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((currTemperature[i-1]-34)*30), r: 2, fill: 'green', className:'dynamic'});

        if(prevVoltX!==null && currVoltage[i-1]!==undefined){
            drawLine(svg , {x1:prevVoltX , y1:prevVoltY , x2:40 + 30*(i) , y2:380-((currVoltage[i-1]-34)*30) , stroke:'lightblue' , strokeType:'solid', className:'dynamic'})
        }
        prevVoltX =40 + 30*(i)
        prevVoltY = 380-((currVoltage[i-1]-34)*30)
        if(currVoltage[i-1]!==undefined){
            drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((currVoltage[i-1]-34)*30), r: 2, fill: 'blue' , className:'dynamic'});

        }

    }

}

function drawAvgChart(svg , arr){
    const dynamic =  svg.querySelectorAll('.dynamic-avg')
    dynamic.forEach(ele => ele.remove() )


    for(let i=1;i<=arr.length;i++){
        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384,className:'dynamic-avg'});
        drawText(svg, {x: 40 + 30 * i, y: 400, text: i, className:'dynamic-avg'});
    }


    for(let i=1;i<=arr.length;i++){
        drawCircle(svg, {cx: 40 + 30*(i), cy: 380-((arr[i-1]-34)*30), r: 2, fill: 'green', className:'dynamic-avg'});
    }

}


staticChart(svg4)
staticChart(avg_voltage)
staticChart(avg_temperature)

