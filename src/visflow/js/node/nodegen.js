export default function generateNode(id) {
    switch (id) {
        case "start": return {
            id: null,
            type: "core",
            title: "Start",
            previous: {},
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
            },
            input: {},
            output: {},
            category: "start",
            width: 160,
        }
        case "print": return {
            id: null,
            type: "core",
            title: "Print",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
            },
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "any",
                },
            },
            output: {},
            category: "void",
            width: 160,
        }
        case "println": return {
            id: null,
            type: "core",
            title: "Println",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
            },
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "any",
                },
            },
            output: {},
            category: "void",
            width: 160,
        }
        case "add": return {
            id: null,
            type: "core",
            title: "Add",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "number"
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: "number"
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "number",
                    order: 1
                },
            },
            category: "binary",
            width: 160,
        }
        case "sub": return {
            id: null,
            type: "core",
            title: "Subtract",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "number"
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: "number"
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "number",
                    order: 1
                },
            },
            category: "binary",
            width: 160,
        }
        case "mul": return {
            id: null,
            type: "core",
            title: "Multiply",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "number"
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: "number"
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "number",
                    order: 1
                },
            },
            category: "binary",
            width: 160,
        }
        case "div": return {
            id: null,
            type: "core",
            title: "Divide",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "number"
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: "number"
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "number",
                    order: 1
                },
            },
            category: "binary",
            width: 160,
        }
        case "greater": return {
            id: null,
            type: "core",
            title: "Greater than",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "geq": return {
            id: null,
            type: "core",
            title: "Greater or Equal",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "less": return {
            id: null,
            type: "core",
            title: "Less than",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "leq": return {
            id: null,
            type: "core",
            title: "Less or Equal",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "equal": return {
            id: null,
            type: "core",
            title: "Equal",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "neq": return {
            id: null,
            type: "core",
            title: "Not Equal",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "and": return {
            id: null,
            type: "core",
            title: "And",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "or": return {
            id: null,
            type: "core",
            title: "Or",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value 2",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "logical",
            width: 160,
        }
        case "unot": return {
            id: null,
            type: "core",
            title: "Unary not",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "boolean"
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "boolean",
                    order: 1
                },
            },
            category: "start",
            width: 160,
        }
        case "umin": return {
            id: null,
            type: "core",
            title: "Multiply",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: "number"
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    dataType: "number",
                    order: 1
                },
            },
            category: "start",
            width: 160,
        }
        case "ifelse": return {
            id: null,
            type: "core",
            title: "If Else",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
                1: {
                    id: null,
                    title: "True",
                    order: 1
                },
                2: {
                    id: null,
                    title: "False",
                    order: 2
                }
            },
            input: {
                0: {
                    id: null,
                    title: "Condition",
                    value: "",
                    dataType: "boolean"
                },
            },
            output: {},
            category: "logical",
            width: 160,
        }
        case "while": return {
            id: null,
            type: "core",
            title: "While Loop",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
                1: {
                    id: null,
                    title: "Body",
                    order: 1
                },
            },
            input: {
                0: {
                    id: null,
                    title: "Condition",
                    value: "",
                    dataType: "boolean"
                },
            },
            output: {},
            category: "loop",
            width: 160,
        }
        case "dowhile": return {
            id: null,
            type: "core",
            title: "Do While Loop",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
                1: {
                    id: null,
                    title: "Body",
                    order: 1
                },
            },
            input: {
                0: {
                    id: null,
                    title: "Condition",
                    value: "",
                    dataType: "boolean"
                },
            },
            output: {},
            category: "loop",
            width: 160,
        }
        case "for": return {
            id: null,
            type: "core",
            title: "For Loop",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {
                0: {
                    id: null,
                    title: null,
                    order: 0
                },
                1: {
                    id: null,
                    title: "Body",
                    order: 1
                },
            },
            input: {
                0: {
                    id: null,
                    title: "Start",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "End",
                    value: "",
                    dataType: ""
                },
                2: {
                    id: null,
                    title: "Step",
                    value: "",
                    dataType: "boolean"
                },
            },
            output: {
                2: {
                    id: null,
                    title: "Index",
                    value: "",
                    dataType: "",
                    order: 2
                },
            },
            category: "loop",
            width: 160,
        }
        case "return": return {
            id: null,
            type: "core",
            title: "Return",
            previous: {
                0: {
                    id: null,
                    title: null,
                }
            },
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value",
                    value: "",
                    dataType: ""
                },
            },
            output: {},
            category: "loop",
            width: 160,
        }
        case "string": return {
            id: null,
            type: "core",
            title: "String",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Set",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Get",
                    value: "",
                    dataType: "",
                    order: 1
                },
            },
            category: "string",
            width: 160,
        }
        case "array": return {
            id: null,
            type: "core",
            title: "Array",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Set",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Get",
                    value: "",
                    dataType: "",
                    order: 1
                },
            },
            category: "array",
            width: 160,
        }
        case "number": return {
            id: null,
            type: "core",
            title: "Number",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Set",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Get",
                    value: "",
                    dataType: "",
                    order: 1
                },
            },
            category: "number",
            width: 160,
        }
        case "boolean": return {
            id: null,
            type: "core",
            title: "Boolean",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Set",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Get",
                    value: "",
                    dataType: "",
                    order: 1
                },
            },
            category: "boolean",
            width: 160,
        }
        case "array": return {
            id: null,
            type: "core",
            title: "Array",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Set",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Get",
                    value: "",
                    dataType: "",
                    order: 1
                },
            },
            category: "array",
            width: 160,
        }
        case "group": return {
            id: null,
            type: "core",
            title: "Group",
            previous: {},
            next: {},
            input: {
                0: {
                    id: null,
                    title: "Value 1",
                    value: "",
                    dataType: ""
                },
            },
            output: {
                0: {
                    id: null,
                    title: "Result",
                    value: "",
                    dataType: "",
                    order: 1
                },
            },
            category: "void",
            width: 160,
        }
    }
}