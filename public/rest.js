const stateColors = ['white', 'yellow', 'green']
var childArray = [];

window.post = function(url, data) {
    return fetch(url, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}



window.onload = function () {
    var grid_div = document.createElement("div")
    grid_div.id = "grid-div"
    grid_div.className = "grid-div"
    document.getElementById('app').appendChild(grid_div);
    
    var x = 0;
    while (x < 30) {
        var child_input = document.createElement("input")
        child_input.className = "child";
        child_input.maxLength = 1;
        child_input.onclick = cycleColor;
        child_input.dataset.state = 0;
        child_input.id = x
        child_input.oninput = generateAnswers;
        childArray.push(child_input)
        document.getElementById(grid_div.id).appendChild(child_input);
        x++;
    }
    
    var results_div = document.createElement("div")
    results_div.className = 'results'
    results_div.id = 'results'
    
    
    
    document.getElementById('app').appendChild(results_div)
}

function drawAnswers(answers) {
    if (document.getElementById('results-container')) {
        document.getElementById('results-container').remove()
    }
    let results_container = document.createElement("div")
    results_container.id = 'results-container'

    results_container.style.setProperty(`--numRows`, `'${Math.ceil(answers.length / 3)}'`)

    for (const answer of answers) {
        let answerElement = document.createElement("div")
        answerElement.className = 'answer-item';
        answerElement.innerText = answer;
        results_container.appendChild(answerElement)

    }

    document.getElementById('results').appendChild(results_container)
} 

function cycleColor() {
    if (this.value != '') {
        let state = parseInt(this.dataset.state)
        state += 1
        state %= 3
        this.dataset.state = state

        this.style.backgroundColor = stateColors[this.dataset.state]
        generateAnswers();
    }
    else if (this.dataset.state != '0') {
        this.dataset.state = 0;
        this.style.backgroundColor = stateColors[this.dataset.state]
        generateAnswers();
    }

}

function generateAnswers() {
    if (this.value == '' && this.dataset.state != '0') {
        this.dataset.state = 0;
        this.style.backgroundColor = stateColors[this.dataset.state]
    }

    let letters = []
    for (const child of childArray) {
        letters.push({'id': child.id, 'state': child.dataset.state, 'value': child.value.toLowerCase()})
    }

    fetch('/answers', {
        method: 'POST',
        body: JSON.stringify({letters}),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        drawAnswers(json.answers)
    });

}
