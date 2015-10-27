//As a user, I can add, subtract, multiply and divide two numbers.
// I can clear the input field with a clear button.
// I can keep chaining mathematical operations together until I hit the clear button, and the calculator will tell me the correct output.

// initialize grand total
if (typeof totalValue == null || typeof totalValue == "undefined") {
    // var totalValue = '';
    var totalValue = 0;
}

// initialize current value tracker
if (typeof currentValue == null || typeof currentValue == "undefined") {
    var currentValue = '';
}

// initialize function text line
if (typeof functionText == null || typeof functionText == "undefined") {
    var functionText = '';
}

// initialize function Array
// important functionArray only holds up to the next = sign keyed in  so it will be different that 
// completeFunctionArray which holds the entire function
if (typeof functionArray == null || typeof functionArray == "undefined") {
    var functionArray = [];
}

// initialize function text line
if (typeof completeFunctionArray == null || typeof completeFunctionArray == "undefined") {
    var completeFunctionArray = [];
}

var lastOpType = "operator";
//var lastOpType = "";
// tracks whether lasKey was operator, operand, or =

$("#plus").click(function () {
    // update formula panel

    setOperator('+');
});


$("#minus").click(function () {
    // update formula panel
    setOperator('-');
});

$("#multiply").click(function () {
    // update formula panel

    setOperator('*');

});

$("#divide").click(function () {
    // update formula panel
    setOperator('/');

});
var decimalUsed = false;

$("#percent").click(function () {
    // update formula panel
    if (typeof currentValue != null && typeof currentValue != "undefined" && currentValue != "" && !isNaN(currentValue)) {
        // store a temporary 0 in 

        functionArray.push("0");

        // calculate value in array

        var baseValue = functionEvaluate();

        // now set currentValue to what ever percentage they chose
        // currentValue should be the percentage amount
        percentVal = currentValue * baseValue / 100;

        functionArray[functionArray.length - 1] = percentVal;
        completeFunctionArray.push(percentVal);
        dispTotals();

    }
})


$("#equal").click(function () {

    if (typeof currentValue != null && typeof currentValue != "undefined" && currentValue != "" && !isNaN(currentValue)) {

        //perform whatever the calculation has been requeste based on current function
        setOperator('=');
        dispTotals();
        lastOpType = "equal sign";

    }
});


$("#one").click(function () {
    setVal(1);

});

$("#two").click(function () {

    setVal(2);

});
$("#three").click(function () {
    setVal(3);

});
$("#four").click(function () {
    setVal(4);

});
$("#five").click(function () {
    setVal(5);

});

$("#six").click(function () {
    setVal(6);

});
$("#seven").click(function () {
    setVal(7);

});
$("#eight").click(function () {
    setVal(8);

});
$("#nine").click(function () {
    setVal(9);

});
$("#zero").click(function () {
    setVal(0);

});

$("#decimalVal").click(function () {
    if (!decimalUsed) {
        setVal(".");
        decimalUsed = true;
    }
});


$("#CE").click(function () {
    lastOpType = "operator";
    decimalUsed = false;
    if (currentValue > 0) {
        clearVal();
        lastOpType = "operator";
    }

});

$("#AC").click(function () {
    lastOpType = "operator";
    decimalUsed = false;
    functionArray = [];
    completeFunctionArray = [];
    totalValue = 0;
    // clear the values
    clearVal();

    //clear the functions
    clearFunc();
});



function addFunctionText(op, type) {
    // This updates the function text line under the main screen
    // add either operator or operand to function text
    if (type == "operator") {
        // if it is an operator we first need to store the number that was typed in into the array
        if (currentValue != '') {
            //store the value into both function and display arrays
            pushFunctionArray(currentValue);
            
        }
    }
    //store the value into both function and display arrays
    pushFunctionArray(op);
   
    // now display the function text
    dispFunctionText();

}

function clearAllVal() {
    // this function clears all values
    // but leaves the totalValue on the display
    // this only occurs after hitting the equal sign 
    // thus allowing us to run a new calculation
    totalValue = "";
    currentValue = '';

}

function clearFunc() {
    // this function clears current function text being displayed

    functionText = "";
    $(".functionText").text(functionText);
}


function clearVal() {
    // this function clears current value
    currentValue = '';
    $(".dispText").text(currentValue);

}


function dispFunctionText() {
    // create the function based on what is in the array and display it    
    //if (completeFunctionArray == []) {
    //    completeFunctionArray = functionArray;
    //}

    functionText = completeFunctionArray.reduce(function (string, num) { return string + num });
    $(".functionText").text(functionText);
    return functionText;

}


function dispTotals() {
    // display both the function text, and the total text
    // then reset the currentValue accumulater so it is ready for another number
    dispFunctionText();
    genTotals();
    currentValue = '';


}


function functionEvaluate() {
    var evalFunction = 0;
    var evalTotal = 0;
    // strip out equal signs from the function
    var evalFunction = functionArray.filter(notEqualSign);
    if (totalValue > 0) {
        evalFunction.splice(0, 0, totalValue);
    }
    // if they have hit = before this section TotalVal should have the running total up to this point
    // and evalfunction should begin with +, -, *, or /.  
    // in that case we can start the function with totalVal

    evalFunction = evalFunction.join("");
    evalTotal = eval(evalFunction);
    return evalTotal;
}

function genTotals() {
    // evaluat everything up to the equal sign, and then dump function Array    
    // evaluate that 
    // generate totals from functionArray

    totalValue = functionEvaluate();

    if (Math.round(totalValue) !== totalValue) {
        //totalValue = totalValue.toFixed(6);

    }
    if (totalValue == "NaN") {
        $(".dispText").text("InvalidFunction");
        $(".functionText").text("Press AC");

    } else {
        totalValue = setDecimals(totalValue);
        $(".dispText").text(totalValue);
    }
    // clear out functionArray
    //completeFunctionArray += functionArray;
    functionArray = [];
    return totalValue;
}


function notEqualSign(value, index, array) {
    // used to strip out the equal signs from the function to later use to calculate total
    if (value != "=") {
        return true;
    } else {
        return false;
    }
}

function pushFunctionArray(item) {
    functionArray.push(item);
    completeFunctionArray.push(item);
}

function roundNum(num, digits) {
    var multiplier = Math.pow(10, digits);
    return Math.round(num * multiplier) / multiplier;
}

function setDecimals(decNum) {
    // figure out how many decimals we need to display

    decNum = parseFloat(decNum);
    var convertToExp = false;
    for (var i = 0; i < 8; i++) {
        if (i > 6) {
            convertToExp = true;
            break;
        } else {
            if (decNum.toFixed(i) == decNum) {
                decNum = decNum.toFixed(i);
                break;
            }
        }

    }
    if (convertToExp) {

        decNum = decNum.toPrecision(7);
    }

    return decNum;
}

function setOperator(operator) {
    // cant have 2 consecutive operators
    if (lastOpType != "operator") {
        addFunctionText(operator, "operator");
        if (currentValue == "") {
            // they havent entered a number yet so ignore the key
        } else {
            //currentOperation = "operator";
            clearVal();
            decimalUsed = false;
        }
        lastOpType = "operator";
        return dispFunctionText();
    }
}


function setVal(value) {
    // this function concatenates number to the string in the display screen
    if (lastOpType != "equal sign") {
        lastOpType = "operand";
        currentValue += value;
        $(".dispText").text(currentValue);
    }
}
