module.exports = {
    getChildren
};

const UNKNOWN = "Unknown";
const INVALID = "Invalid";
const NULL = "Null";

const PROGRAM = "Program";
const VARIABLE_DECLARATION = "VariableDeclaration";
const VARIABLE_DECLARATOR = "VariableDeclarator";
const IDENTIFIER = "Identifier";
const LITERAL = "Literal";
const EXPRESSION_STATEMENT = "ExpressionStatement";
const CALL_EXPRESSION = "CallExpression";
const MEMBER_EXPRESSION = "MemberExpression";
const IF_STATEMENT = "IfStatement";
const BINARY_EXPRESSION = "BinaryExpression";
const SPREAD_ELEMENT = "SpreadElement";
const EMPTY_STATEMENT = "EmptyStatement";
const BLOCK_STATEMENT = "BlockStatement";
const WHILE_STATEMENT = "WhileStatement";
const CONTINUE_STATEMENT = "ContinueStatement";
const BREAK_STATEMENT = "BreakStatement";
const FOR_STATEMENT = "ForStatement";
const UPDATE_EXPRESSION = "UpdateExpression";
const LABELED_STATEMENT = "LabeledStatement";
const ASSIGNMENT_EXPRESSION = "AssignmentExpression";
const CONDITIONAL_EXPRESSION = "ConditionalExpression";
const THIS_EXPRESSION = "ThisExpression";
const FUNCTION_DECLARATION = "FunctionDeclaration";
const WITH_STATEMENT = "WithStatement";
const SEQUENCE_EXPRESSION = "SequenceExpression";
const FUNCTION_EXPRESSION = "FunctionExpression";
const ARROW_FUNCTION_EXPRESSION = "ArrowFunctionExpression";
const RETURN_STATEMENT = "ReturnStatement";
const SWITCH_STATEMENT = "SwitchStatement";
const SWITCH_CASE = "SwitchCase";
const THROW_STATEMENT = "ThrowStatement";
const TRY_STATEMENT = "TryStatement";
const CATCH_CLAUSE = "CatchClause";
const DO_WHILE_STATEMENT = "DoWhileStatement";
const FOR_IN_STATEMENT = "ForInStatement";
const FOR_OF_STATEMENT = "ForOfStatement";
const DEBUGGER_STATEMENT = "DebuggerStatement";
const ARRAY_EXPRESSION = "ArrayExpression";
const NEW_EXPRESSION = "NewExpression";
const OBJECT_EXPRESSION = "ObjectExpression";
const PROPERTY = "Property";
const UNARY_EXPRESSION = "UnaryExpression";
const LOGICAL_EXPRESSION = "LogicalExpression";
const YIELD_EXPRESSION = "YieldExpression";
const ARRAY_PATTERN = "ArrayPattern";
const OBJECT_PATTERN = "ObjectPattern";
const REST_ELEMENT = "RestElement";
const ASSIGNMENT_PATTERN = "AssignmentPattern";
const TEMPLATE_LITERAL = "TemplateLiteral";
const TEMPLATE_ELEMENT = "TemplateElement";
const CLASS_DECLARATION = "ClassDeclaration";
const CLASS_BODY = "ClassBody";
const METHOD_DEFINITION = "MethodDefinition";

/**
 *
 * Returns the children, if any, of a node produced by Acorn's parser.
 *
 * @param {acorn.Node} node
 * The node we wish to get the children of.
 *
 * @returns {acorn.Node[]}
 * An array, which may be empty, containing all the children of the given node.
 *
 */
function getChildren(node) { 
    if (node===null) return [{type: NULL}];
    if (!node.type) return [{type: INVALID, body: node}];
    
    switch(node.type) {
        // branches
        case PROGRAM: return node.body;
        case VARIABLE_DECLARATION: return node.declarations;
        case VARIABLE_DECLARATOR: return [node.id, node.init];
        case IDENTIFIER: return [];
        case LITERAL: return [];
        case EXPRESSION_STATEMENT: return [node.expression];
        case CALL_EXPRESSION: return [node.callee].concat(node.arguments);
        case MEMBER_EXPRESSION: return [node.object, node.property];
        case IF_STATEMENT: return [node.test, node.consequent, node.alternate];
        case BINARY_EXPRESSION: return [node.left, node.right];
        case SPREAD_ELEMENT: return [node.argument];
        case BLOCK_STATEMENT: return node.body;
        case WHILE_STATEMENT: return [node.test].concat(node.body);
        case CONTINUE_STATEMENT: return [node.label];
        case BREAK_STATEMENT: return [node.label];
        case FOR_STATEMENT: return [node.init, node.test, node.update].concat(node.body);
        case UPDATE_EXPRESSION: return [node.argument];
        case LABELED_STATEMENT: return [node.label].concat(node.body);
        case ASSIGNMENT_EXPRESSION: return [node.left, node.right];
        case CONDITIONAL_EXPRESSION: return [node.test, node.consequent, node.alternate];
        case FUNCTION_DECLARATION: return [node.id].concat(node.params).concat(node.body);
        case WITH_STATEMENT: return [node.object].concat(node.body);
        case SEQUENCE_EXPRESSION: return node.expressions;
        case FUNCTION_EXPRESSION: return [node.id].concat(node.params).concat(node.body);
        case ARROW_FUNCTION_EXPRESSION: return node.params.concat(node.body);
        case RETURN_STATEMENT: return [node.argument];
        case SWITCH_STATEMENT: return [node.discriminant].concat(node.cases);
        case SWITCH_CASE: return [node.test].concat(node.consequent);
        case THROW_STATEMENT: return [node.argument];
        case TRY_STATEMENT: return [node.block, node.handler, node.finalizer]; 
        case CATCH_CLAUSE: return [node.param].concat(node.body);
        case DO_WHILE_STATEMENT: return [node.test].concat(node.body);
        case FOR_IN_STATEMENT: return [node.left, node.right].concat(node.body);
        case FOR_OF_STATEMENT: return [node.left, node.right].concat(node.body);
        case ARRAY_EXPRESSION: return node.elements;
        case NEW_EXPRESSION: return [node.callee].concat(node.arguments);
        case OBJECT_EXPRESSION: return node.properties;
        case PROPERTY: return [node.key, node.value];
        case UNARY_EXPRESSION: return [node.argument];
        case LOGICAL_EXPRESSION: return [node.left, node.right];
        case YIELD_EXPRESSION: return [node.argument];
        case ARRAY_PATTERN: return node.elements;
        case OBJECT_PATTERN: return node.properties;
        case REST_ELEMENT: return [node.argument];
        case ASSIGNMENT_PATTERN: return [node.left, node.right];
        case TEMPLATE_LITERAL: return node.expressions.concat(node.quasis);
        case CLASS_DECLARATION: return [node.body];
        case CLASS_BODY: return node.body;
        case METHOD_DEFINITION: return [node.value];
        // leaves
        case IDENTIFIER: 
        case LITERAL: 
        case EMPTY_STATEMENT:
        case THIS_EXPRESSION: 
        case DEBUGGER_STATEMENT: 
        case TEMPLATE_ELEMENT: 
        case UNKNOWN:
        case INVALID: 
        case NULL: return [];
        default: 
            return [{type: UNKNOWN, body: node}];
    }
}