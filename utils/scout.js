const fs = require("fs");
const parser = require("acorn");
const visitor = require("./visitor");

module.exports = {
    parse,
    scout
};

// This program was used to document its own files.

/**
 *
 * Wrapper for Acorn's parse function.
 *
 * @param {string} fpath
 * Path to a JS file.
 * @param {acorn.Options} options
 * Acorn Parser options.
 *
 * @returns {acorn.Node}
 * Program node.
 *
 */
function parse(fpath, options) {
    return parser.parse(fs.readFileSync(fpath, "utf8"), options);
}

/**
 *
 * Finds all documentable functions and classes, 
 * and returns all the relevant meta information about each result.
 *
 * @param {string} filecontents
 * Text content of a JS file.
 *
 * @returns {object[]}
 * Array with meta information objects.
 *
 */
function scout(filecontents) {
    let nodes = documentables(parser.parse(filecontents));
    return metainfo(nodes, filecontents);
}

/**
 *
 * Gathers meta information for all documentable functions and classes found.
 *
 * @param {acorn.Node[]} docnodes
 * An array of nodes representing documentable functions and classes.
 * @param {string} basetext
 * Text content of a JS file.
 *
 * @returns {object[]}
 * Array with meta information objects.
 *
 */
function metainfo(docnodes, basetext) {
    let meta = [];
    let text = basetext.replace(/\r/g,"").replace(/\t/g,"    ");
    let lines = text.split("\n");
    let classtext = {}; // cache

    for (node of docnodes) {
        let tree = node.content;
        let reg;
        let lineloc = -1;
        let indent = 0;

        if (tree.type === "MethodDefinition") {
            if (!classtext[node.class]) classtext[node.class] = extractClass(node.class, text); // check cache
            // indexToLine(index within class + index of class, lines)
            reg = buildRegExp(tree).exec(classtext[node.class].text);
            if (reg!=null) {
                let o = indexToLine(reg.index+classtext[node.class].start,lines);
                lineloc = o.line; indent = o.indent;
            }
        } else {
            reg = buildRegExp(tree).exec(text);
            if (reg!=null) {
                let o = indexToLine(reg.index, lines);
                lineloc = o.line; indent = o.indent;
            }
        }

        if (lineloc==-1 || indent==-1) continue; // something went wrong

        if (tree.type === "ClassDeclaration") 
            meta.push({type: tree.type, line: lineloc, indent: indent, header: reg[0]});
        else if (tree.type === "MethodDefinition") 
            meta.push({type: tree.type, line: lineloc, indent: indent, header: reg[0], class: node.class, 
                       params: tree.value.params.map((p) => p.name)});
        else if (tree.type === "FunctionDeclaration") 
            meta.push({type: tree.type, line: lineloc, indent: indent, header: reg[0], class: node.class, 
                       params: tree.params.map((p) => p.name)});
        else
            meta.push({type: tree.type, line: lineloc, indent: indent, header: node.kind+" "+reg[0], 
                       class: node.class, params: tree.init.params.map((p) => p.name)});
    }

    return meta;
}

/**
 *
 * Finds the line and indentation of a character in a text file.
 *
 * @param {number} index
 * Index of the character.
 * @param {string[]} lines
 * Lines of the text file.
 *
 * @returns {object}
 * Object with line and indentation values.
 *
 */
function indexToLine(index, lines) {
    if (index<0) return {line: -1, indent: -1};

    let count = 0;
    let indent = 0;
    for (let i=0; i<lines.length; i++) {
        indent = count;
        count += lines[i].length+1;
        if (index<count) return {line: i+1, indent: index-indent};
    }
    return {line: -1, indent: -1};
}

/**
 *
 * Extracts all text within a class, including its declaration.
 *
 * @param {string} classname
 * Name of the class.
 * @param {string} text
 * Text content of a file.
 *
 * @returns {object}
 * Object with start index and all text within the class.
 *
 */
function extractClass(classname, text) {
    let start = new RegExp("class[ \t\n]+"+classname+"[ \t\n]*{").exec(text).index;
    let braces = 0;
    let entered = false;
    let finish = -1;
    for (let i=start; i<text.length; i++) {
        if (text[i]=="{") {
            braces++;
            if (!entered) entered = true;
        }
        if (text[i]=="}") {
            braces--;
        }
        if (entered && braces==0) {
            finish = i+1;
            break;
        }
    }
    return {start: start, text: text.substring(start,finish)};
}

/**
 *
 * Builds a regular expression based on a node's type 
 * capable of finding that node in plain text.
 *
 * @param {acorn.Node} node
 * A node created by Acorn's parser.
 *
 * @returns {RegExp}
 * A regular expression.
 *
 */
function buildRegExp(node) {
    let any = "[ \t\n]*";
    let many = "[ \t\n]+";
    let r = "";

    if (node.type === "FunctionDeclaration") {
        if (node.async) r = "async"+many;
        r += "function";
        if (node.generator) r += any+"\\*"+any;
        else r += many;
        r += node.id.name+any+"\\(";       
        for (let i=0; i<node.params.length; i++) {
            r += any+node.params[i].name+any;
            if (i!=node.params.length-1) r += ",";
        }
        r += "\\)"+any+"{";
    }

    else if (node.type === "VariableDeclarator" && node.init.type === "FunctionExpression") {
        r = node.id.name+any+"="+any;
        if (node.init.async) r += "async"+many;
        r += "function";
        if (node.init.generator) r += any+"\\*";
        r += any;
        r += "\\(";
        for (let i=0; i<node.init.params.length; i++) {
            r += any+node.init.params[i].name+any;
            if (i!=node.init.params.length-1) r += ",";
        }
        r += "\\)"+any+"{";
    }

    else if (node.type === "VariableDeclarator" && node.init.type === "ArrowFunctionExpression") {
        r = node.id.name+any+"="+any;
        if (node.init.async) r += "async"+many;
        r += "\\(";
        for (let i=0; i<node.init.params.length; i++) {
            r += any+node.init.params[i].name+any;
            if (i!=node.init.params.length-1) r += ",";
        }
        r += "\\)"+any+"=>";
    }

    else if (node.type === "ClassDeclaration") {
        r = "class"+many+node.id.name+any+"{";
    }

    else if (node.type === "MethodDefinition") {
        if (node.static) r += "static"+many;
        if (node.kind === "get") r += "get"+many;
        if (node.kind === "set") r += "set"+many;
        r += node.key.name+any+"\\(";
        if (node.kind === "set") r += any+node.value.params[0].name+any;
        if (node.kind === "method" || node.kind === "constructor") {
            for (let i=0; i<node.value.params.length; i++) {
                r += any+node.value.params[i].name+any;
                if (i!=node.value.params.length-1) r += ",";
            }
        }
        r += "\\)"+any+"{";      
    }

    return new RegExp(r);
}

/**
 *
 * Explores the AST and finds functions and classes
 * that can be documented.
 *
 * @param {acorn.Node} basenode
 * The Program node created by Acorn's parser.
 *
 * @returns {acorn.Node[]}
 * A list of function/class Acorn nodes.
 *
 */
function documentables(basenode) {
    let stack = [{class: null, content: basenode}];
    let intermediary = [];

    while (stack.length>0) {
        let next = stack.pop();
        let tree = next.content;

        // add to stack

        if (tree.type === "Program" /*global*/) {
            stack = stack.concat(visitor.getChildren(tree)
                .map((n) => { return {class: null, content: n} } ).reverse());
        }    
        
        if (tree.type === "ClassDeclaration" /*class*/) {
            stack = stack.concat(visitor.getChildren(tree)
                .map((n) => { return {class: tree.id.name, content: n} } ).reverse());
            
            intermediary.push({class: null, content: tree});  
        }  

        // add to doc list

        if (tree.type === "FunctionDeclaration") intermediary.push(next);        

        else if (tree.type === "VariableDeclaration") {
            for (node of tree.declarations) {
                if (node.init!=null && (node.init.type === "FunctionExpression" || 
                    node.init.type === "ArrowFunctionExpression"))
                        intermediary.push({class: next.class, content: node, kind: tree.kind});  
            }
        }

        else if (tree.type === "ClassBody") {
            for (node of tree.body) {
                if (node.type === "MethodDefinition") 
                    intermediary.push({class: next.class, content: node});  
            }
        }
    }

    return intermediary;
}