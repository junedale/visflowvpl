import { stage } from "../app-renderer.js";
import { selectedNodeList } from "../menu/modifymodal.js";


export function validateGeneratorForms(type) {
    if (type === 0) {
        return handleVariableGenerator();
    } else if (type === 1) {
        return handleFunctionGenerator();
    }
}


function handleVariableGenerator() {
    let message = [];
    const varName = document.querySelector("#var-name");
    const varType = document.querySelector("#var-type");
    const varValue = document.querySelector("#var-value");

    if (varName.value === "") {
        message.push("<div>Variable name must be specified.</div>");
    }

    if (varType.value === "number" && isNaN(varValue.value)) {
        message.push("<div>Variable value must be a number.</div>");
    }

    if (varType.value === "boolean" && (varValue.value.toLowerCase() !== "true" || varValue.value.toLowerCase() !== "false")) {
        message.push("<div>Variable value must be of type boolean.</div>");
    }

    if(message.length !== 0) {
        return message;
    } else {
        stage.fire("create-variable", { varName: varName.value, varType: varType.value, varValue: varValue.value });
        return null;
    }
}

function handleFunctionGenerator() {
    let message = [];
    const funName = document.querySelector("#fun-name");
    const funType = document.querySelector("#fun-type");
    const funArgs = document.querySelector("#fun-args");

    if (funName.value === "") {
        message.push("<div>Function name must be specified.</div>");
    }

    if(message.length !== 0) {
        return message;
    } else {
        stage.fire("create-function", { funName: funName.value, funType: funType.value, funArgs: funArgs.value, children: selectedNodeList === null ? [] : selectedNodeList });
        selectedNodeList.length = 0;
        return null;
    }
}