const symbol = {
      "I" : 1,
      "V" : 5 ,
      "X" : 10,
      "L" : 50,
      "C" : 100,
      "D" : 500,
     "M" : 1000
}


function roman(num){
    let ans = ""
    while(num>=1000){
        ans+="M"
        num-=1000
    }
    while(num>=900){
        ans+="CM"
        num-=900
    }
    while(num>=500){
        ans+="D"
        num-=500
    }
    while(num>=400){
        ans+="CD"
        num-=400
    }
    while(num>=100){
        ans+="C"
        num-=100
    }
    while(num>=90){
        ans+="XC"
        num-=90
    }
    while(num>=50){
        ans+="L"
        num-=50
    }
    while(num>=40){
        ans+="XL"
        num-=40
    }
    while(num>=10){
        ans+="X"
        num-=10
    }
    while(num>=9){
        ans+="IX"
        num-=9
    }
    while(num>=5){
        ans+="V"
        num-=5
    }
    while(num>=4){
        ans+="IV"
        num-=4
    }
    while(num>=1){
        ans+="I"
        num-=1
    }
    return ans;



}

function integer(roman){
    let prev
    let ans = 0

    for(let i=0;i<roman.length;i++){
        let curr = roman[i]
        if(prev!==undefined && (symbol[prev] < symbol[curr])){
            ans = ans + (( symbol[curr]) - 2*symbol[prev])
        }else{
            ans+= symbol[curr]
        }
        prev = roman[i]
    }
    return ans
}

const integer_input = document.getElementById("integer_input")
const integer_output = document.getElementById("integer_output")

const roman_input = document.getElementById("roman_input")
const roman_output = document.getElementById("roman_output")

integer_input.addEventListener('input' , ()=>{
    let input = integer_input.value
    if(input===''){
        integer_output.innerText = "Roman is..."
    }else{
        integer_output.innerText = roman(input)
    }

})

roman_input.addEventListener('input' , ()=>{
    let input = (roman_input.value).toUpperCase()
    if(input===''){
        roman_output.innerText = "Integer is..."
    }else{
        let ans = integer(input)
        if(Number.isNaN(ans)){
            roman_output.innerText = "Invalid input"
        }else{
            roman_output.innerText = ans

        }

    }
})

