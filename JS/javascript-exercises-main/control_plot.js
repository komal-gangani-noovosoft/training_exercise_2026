let sum = 0
let count = 0
let batch = 1
let arr = []
for(let i=0;i<samples.length;i++){
    if(samples[i].batch!==batch){
        arr.push(sum/count)
        sum = samples[i].value
        count = 1
        batch = samples[i].batch
    }else{
        sum+= samples[i].value
        count++
    }

}
arr.push(sum/count)
console.log(arr.length)
console.log(arr)


function drawControlPlot(svg){
    for(let i=0;i<=12;i++){
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i ), x2: 40, y2: 20 + 30 * (i )});
        drawText(svg, {x: 20, y: 25 + 30 * (i ), text: 46-i});
    }

    for(let i=1;i<=60;i++){
        drawLine(svg, {x1: 40 + 23 * i, y1: 380, x2: 40 + 23 * i, y2: 384});
        drawText(svg, {x: 35 + 23 * i, y: 400, text: i});

    }

    drawLine(svg, {x1: 40, y1: 380, x2: 1440, y2: 380});

    drawLine(svg, {x1: 40, y1: 20, x2: 40, y2: 380});

    drawLine(svg, {x1: 40, y1: 180, x2: 1440, y2: 180 , stroke:'green'});

    drawLine(svg, {x1: 40, y1: 150, x2: 1440, y2: 150 , stroke:'yellow' , strokeType :'dashed'});

    drawLine(svg, {x1: 40, y1: 120, x2: 1440, y2: 120 , stroke:'orange' , strokeType :'dashed'});

    drawLine(svg, {x1: 40, y1: 90, x2: 1440, y2: 90 , stroke:'red' , strokeType :'dashed'});

    drawLine(svg, {x1: 40, y1: 210, x2: 1440, y2: 210 , stroke:'yellow' , strokeType :'dashed'});

    drawLine(svg, {x1: 40, y1: 240, x2: 1440, y2: 240 , stroke:'orange' , strokeType :'dashed'});

    drawLine(svg, {x1: 40, y1: 270, x2: 1440, y2: 270 , stroke:'red' , strokeType :'dashed'});
    for(let i=0;i<60;i++){
        drawCircle(svg, {cx: 43 + 23*(i+1), cy: 380-((arr[i]-33.5)*30), r: 2, fill: 'green'});
    }
}

document.querySelectorAll('[id^="btn"]').forEach(btn => {
    btn.addEventListener('click' , (event) =>{
        const id = event.target.id.replace('btn' , '')
        window[`rule${id}`](svg3);
    })
})

const svg3 = document.getElementById('svg3')

document.getElementById("clear" ).addEventListener("click" , ()=> clear(svg3))


function map_data(red_ind , svg){
    for(let i=0;i<60;i++){
        if(red_ind.has(i)){
            drawCircle(svg, {cx: 43 + 23*(i+1), cy: 380-((arr[i]-33.5)*30), r: 2, fill: 'red'});
        }else{
            drawCircle(svg, {cx: 43 + 23*(i+1), cy: 380-((arr[i]-33.5)*30), r: 2, fill: 'lightgreen'});
        }
    }
}
function rule1(svg){
    for(let i=0;i<60;i++){
        if(arr[i]>43 || arr[i]<37){
            drawCircle(svg, {cx: 43 + 23*(i+1), cy: 380-((arr[i]-33.5)*30), r: 2, fill: 'red'});
        }else{
            drawCircle(svg, {cx: 43 + 23*(i+1), cy: 380-((arr[i]-33.5)*30), r: 2, fill: 'lightgreen'});
        }
    }
}

function rule2(svg){
    let red_ind = new Set()
    let cntd = 1
    let cnti = 1

    for(let i=1;i<60;i++){

        if(arr[i]<arr[i-1]){
            cnti = 1;
            cntd += 1;
        }else if(arr[i]>arr[i-1]){
            cntd = 1;
            cnti += 1;
        }else{
            cntd = 1;
            cnti = 1;
        }
        if(cnti>=5 || cntd>=5){
            for(let j=0;j<5;j++){
                red_ind.add(i-j)
            }
        }

    }
    map_data(red_ind,svg)
}

function rule3(svg){
    let cntd = 0
    let cntu = 0
    let red_ind = new Set()

    for(let i=0;i<60;i++){

        if(arr[i]<40){
            cntu = 0;
            cntd += 1;
        }else if(arr[i]>40){
            cntd = 0;
            cntu += 1;
        }else{
            cntu = 0;
            cntd = 0;
        }
        if(cntu>=6 || cntd>=6){
            for(let j=0;j<6;j++){
                red_ind.add(i-j)
            }

        }

    }
    map_data(red_ind , svg)
}

function rule4(svg){
    let cnt = 1
    let trend = 0
    let red_ind = new Set()

    for(let i=1;i<60;i++){
        let currentTrend = 0;

        if (arr[i] > arr[i-1]) {
            currentTrend = 1;
        } else if (arr[i] < arr[i-1]) {
            currentTrend = -1;
        }

        if (currentTrend !== 0 && currentTrend === -trend) {
            cnt++;
            trend = currentTrend;
        } else if (currentTrend !== 0) {
            cnt = 2;
            trend = currentTrend;
        } else {
            cnt = 1;
            trend = 0;
        }
        if(cnt>=7){
            for(let j=0;j<6;j++){
                red_ind.add(i-j)
            }

        }

    }
    map_data(red_ind , svg)
}

function rule5(svg){
    let red_ind = new Set()
    for(let i=2;i<60;i++){

        let d1 = arr[i]
        let d2 = arr[i-1]
        let d3 = arr[i-2]

        let upper = (d1>=42) + (d2>=42) + (d3>=42)
        let lower = (d1<=38) + (d2<=38) + (d3<=38)

        if(upper>=2 || lower>=2){
            for(let j=0;j<3;j++){
                red_ind.add(i-j)
            }
        }
    }
    map_data(red_ind,svg)
}

function rule6(svg){
    let red_ind = new Set()
    for(let i=5;i<60;i++){

        let d1 = arr[i]
        let d2 = arr[i-1]
        let d3 = arr[i-2]

        let cntu = (d1>=41) + (d2>=41) + (d3>=41)
        let cntl = (d1<=39) + (d2<=39) + (d3<=39)

        if(cntu>=4 || cntl>=4){
            for(let j=0;j<5;j++){
                red_ind.add(i-j)
            }
        }
    }
    map_data(red_ind,svg)
}

function rule7(svg){
    let cnt = 0
    let red_ind = new Set()
    for(let i=0;i<60;i++){

        if(arr[i]<41 && arr[i]>39 ){
            cnt += 1;
        }else {
            cnt = 0
        }
        if(cnt>=14){
            for(let j=0;j<15;j++){
                red_ind.add(i-j)
            }

        }

    }
    map_data(red_ind,svg)
}

function clear(svg){
    for(let i=0;i<60;i++){
        drawCircle(svg, {cx: 43 + 23*(i+1), cy: 380-((arr[i]-33.5)*30), r: 2, fill: 'green'});
    }
}


