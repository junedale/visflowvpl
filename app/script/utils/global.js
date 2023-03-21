export function setLocation(loc, stage) {
    if (stage === null) {
        return {
            x: (loc.x - this.x()) / this.scaleX(),
            y: (loc.y - this.y()) / this.scaleY()
        };
    } else {
        return {
            x: (loc.x - stage.x()) / stage.scaleX(),
            y: (loc.y - stage.y()) / stage.scaleY()
        };
    }
}


export const ColorMap = {
    start: '#0d9488',       // emerald
    binary: '#dc2626',      // red
    conditional: '#9333ea', // purple
    loop: '#cda434',        // yellow
    void: '#e11d48',        // pinkish
    logical: '#2563eb',      // blue,
    function: '#f98754',
    variable: '#82434C'
}

export const HTML = {
    mainMenu: `
        <div class="mb-3">
            <label for="context-search" class="form-label">Node List</label>
            <input type="text" id="context-search" class="form-control" placeholder="Search Nodes">
        </div>
        <div class="node-list overflow-y-auto">
            <div class="accordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#generator">
                            Generator Nodes
                        </button>
                    </h2>
                    <div id="generator" class="accordion-collapse collapse show list-group list-group-flush">
                        <button id="variable-generator" class="list-group-item list-group-item-action node">Variable</button>
                        <button id="function-generator" class="list-group-item list-group-item-action node">Function</button>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#core-function">
                            Core Function Nodes
                        </button>
                    </h2>
                    <div id="core-function" class="accordion-collapse collapse show list-group list-group-flush">
                        <button id="start" class="list-group-item list-group-item-action node">Start Node</button>
                        <button id="return" class="list-group-item list-group-item-action node">Return Node</button>
                        <button id="print" class="list-group-item list-group-item-action node">Print Node</button>
                        <button id="assign" class="list-group-item list-group-item-action node">Assign Node</button>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#binary">
                            Binary Nodes
                        </button>
                    </h2>
                    <div id="binary" class="accordion-collapse collapse show list-group list-group-flush">
                        <button id="add" class="list-group-item list-group-item-action node">Add Node</button>
                        <button id="sub" class="list-group-item list-group-item-action node">Subtract Node</button>
                        <button id="mul" class="list-group-item list-group-item-action node">Multiply Node</button>
                        <button id="div" class="list-group-item list-group-item-action node">Divide Node</button>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#relational">
                            Relational Nodes
                        </button>
                    </h2>
                    <div id="relational" class="accordion-collapse collapse show list-group list-group-flush">
                        <button id="greater" class="list-group-item list-group-item-action node">Greater Than Node</button>
                        <button id="geq" class="list-group-item list-group-item-action node">Greater Or Equal Node</button>
                        <button id="less" class="list-group-item list-group-item-action node">Less Than Node</button>
                        <button id="leq" class="list-group-item list-group-item-action node">Less Or Equal Node</button>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#logical">
                            Logical Nodes
                        </button>
                    </h2>
                    <div id="logical" class="accordion-collapse collapse show list-group list-group-flush">
                        <button id="and" class="list-group-item list-group-item-action node">And Node</button>
                        <button id="or" class="list-group-item list-group-item-action node">Or Node</button>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#control-structure">
                            Control Structure Nodes
                        </button>
                    </h2>
                    <div id="logical" class="accordion-collapse collapse show list-group list-group-flush">
                        <button id="ifelse" class="list-group-item list-group-item-action node">If Else Node</button>
                        <button id="while" class="list-group-item list-group-item-action node">While Node</button>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#var-list">
                            Variable List
                        </button>
                    </h2>
                    <div id="var-list" class="accordion-collapse collapse show list-group list-group-flush"></div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#fun-list">
                            Function List
                        </button>
                    </h2>
                    <div id="fun-list" class="accordion-collapse collapse show list-group list-group-flush"></div>
                </div>
            </div>
        </div>
        `,
    input: function (id, label) {
        return `
        <div class="mb-3">
            <label for="file-input" class="form-label">${label}</label>
            <input type="text" id="${id}" class="form-control" placeholder="Name">
        </div>
        `;
    },
    variableForm: `
        <div class="mb-3">
            <label for="var-name" class="form-label">Variable Name</label>
            <input type="text" id="var-name" class="form-control" placeholder="Name">
        </div>
        <div class="mb-3">
            <label for="var-type" class="form-label">Data Type</label>
            <select id="var-type" class="form-select">
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="var-value" class="form-label">Value</label>
            <input type="text" id="var-value" class="form-control" placeholder="Value">
        </div>
        <button id="create-var-btn" class="btn btn-primary w-100">Create</button>
        `,
    functionForm: `
        <div class="mb-3">
            <label for="fun-name" class="form-label">Function Name</label>
            <input type="text" id="fun-name" class="form-control" placeholder="Name">
        </div>
        <div class="mb-3">
            <label for="fun-type" class="form-label">Return Type</label>
            <select id="fun-type" class="form-select">
                <option value="void">Void</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="fun-args" class="form-label">Parameter Count</label>
            <input type="number" id="fun-args" class="form-control" min="0" placeholder="0">
        </div>
        <button id="create-fun-btn" class="btn btn-primary w-100">Create</button>
        `,
    modifyBaseNode: `
        <div class="d-flex flex-column gap-2">
            <button id="collapse-node" class="btn btn-secondary w-100">Collapse Node</button>
            <button id="delete-node" class="btn btn-danger w-100">Delete Node</button>
        </div>
        `,
    modifyFunctionNode: `
        <div class="d-flex flex-column gap-2">
            <button id="edit-node" class="btn btn-secondary w-100">Edit Node</button>
            <button id="delete-node" class="btn btn-danger w-100">Delete Node</button>
        </div>
        `,
    selectNode: `
        <div class="d-flex flex-column gap-2">
            <button id="create-fun-from-selected" class="btn btn-primary w-100">Create Function Node</button>
            <button id="delete-node" class="btn btn-danger w-100">Delete Node</button>
        </div>
        `,
}
