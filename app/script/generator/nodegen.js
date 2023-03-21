export function generateNode(id) {
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
                    title: "Value 1",
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
                    title: "Value 1",
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
                    title: "Value 1",
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
                    title: "Value 1",
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
                    title: "Value 1",
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
                    title: "Value 1",
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
        case "return": return {
            id: null,
            type: "core",
            title: "While Loop",
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
        case "assign": return {
            id: null,
            type: "core",
            title: "Assign",
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
                    title: "Variable",
                    value: "",
                    dataType: ""
                },
                1: {
                    id: null,
                    title: "Value",
                    value: "",
                    dataType: ""
                },
            },
            output: {},
            category: "variable",
            width: 160,
        }
    } 
}