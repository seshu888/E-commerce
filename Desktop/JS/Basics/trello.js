66       //  const Array=['muuna','abhi','seshu','sravani','priya'];


// for(let i=0;i<Array.length;i++){
//     console.log(Array[i])
// }

// const todos=[];
// todos.push('seshu');
// todos.push('sravni');
// todos.push('manu');

// todos.forEach(function(todo,index){
//     console.log(` ${todo} hdh ${index}`);
// })

// days.forEach(function(tiger,index  ){
//     console.log(tiger)
// })



// newone
let myWorks = {
    day:'Monday',
    meetings:0,
    meetdone:0 ,
}

function addMeeting(work,meet=0 ){
    work.meetings=work.meetings+meet
}
function meetdone(work,meet=0 ){
    work.meetdone=work.meetdone-meet
}
function resetDay(todo){
    todo.meetings=0;
    todo.meetdone=0;
}
function getSummary(todo){ 
    meetLeft= todo.meetings+todo.meetdone
    return `you have ${meetLeft} today`
}
addMeeting(myWorks,4)
meetdone(myWorks,2)
console.log(myWorks)
console.log(getSummary(myWorks))