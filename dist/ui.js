"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");require("core-js/modules/es.array.flat"),require("core-js/modules/es.array.includes"),require("core-js/modules/es.array.iterator"),require("core-js/modules/es.array.unscopables.flat"),require("core-js/modules/es.object.entries"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.populateQueue=populateQueue,exports.default=exports.TaskList=exports.Task=exports.OfflineWarning=exports.Warning=exports.Debug=exports.CommandError=void 0;var _objectSpread2=_interopRequireDefault(require("@babel/runtime/helpers/objectSpread")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_react=_interopRequireWildcard(require("react")),_propTypes=_interopRequireDefault(require("prop-types")),_lodash=require("lodash"),_chalk=require("chalk"),_pQueue=_interopRequireDefault(require("p-queue")),_pino=_interopRequireDefault(require("pino")),_isOnline=_interopRequireDefault(require("is-online")),_ink=require("ink"),_inkBox=_interopRequireDefault(require("ink-box")),_inkSpinner=_interopRequireDefault(require("ink-spinner")),_inkSelectInput=_interopRequireDefault(require("ink-select-input")),_figures=_interopRequireDefault(require("figures")),_cardinal=require("cardinal"),_commands=_interopRequireDefault(require("./commands")),_utils=require("./utils"),_common=require("./utils/common");const{assign,entries}=Object,dict=a=>new Map(entries(a)),space=" ",Check=({isSkipped:a})=>_react.default.createElement(_ink.Color,{bold:!0,green:!a,dim:a},_figures.default.tick,space),X=()=>_react.default.createElement(_ink.Color,{bold:!0,red:!0},_figures.default.cross,space),Pending=()=>_react.default.createElement(_ink.Color,{cyan:!0},_react.default.createElement(_inkSpinner.default,null),space),Item=({isSelected:a,label:b})=>_react.default.createElement(_ink.Color,{bold:a,cyan:a},b),Indicator=({isSelected:a})=>_react.default.createElement(_ink.Box,{marginRight:1},a?_react.default.createElement(_ink.Color,{bold:!0,cyan:!0},_figures.default.arrowRight):" "),CommandError=a=>{const b=(0,_pino.default)({prettyPrint:{levelFirst:!0}},_pino.default.destination("./tomo-errors.txt"));return(0,_react.useEffect)(()=>{b.error(a)},[]),_react.default.createElement(_ink.Box,{flexDirection:"column",marginTop:1,marginLeft:1},_react.default.createElement(_ink.Box,null,_react.default.createElement(X,null),_react.default.createElement(_ink.Text,null,"Something has gone horribly ",_react.default.createElement(_ink.Color,{bold:!0,red:!0},"wrong"))),_react.default.createElement(_ink.Box,{marginLeft:2},"\u21B3",space,_react.default.createElement(_ink.Color,{dim:!0},"Details written to ./tomo-errors.txt")))};exports.CommandError=CommandError;const Debug=({data:a,title:b})=>_react.default.createElement(_ink.Box,{flexDirection:"column",marginTop:1,marginLeft:1},_react.default.createElement(_ink.Box,null,_react.default.createElement(_ink.Color,{bold:!0,cyan:!0},"DEBUG: "),_react.default.createElement(_ink.Color,{dim:!0},b)),_react.default.createElement(_ink.Box,null,(0,_cardinal.highlight)((0,_common.format)(a))));exports.Debug=Debug;const Description=({command:a})=>{return _react.default.createElement(_ink.Box,{marginBottom:1},_react.default.createElement(_ink.Color,{cyan:!0},(a=>{const b=`${(0,_chalk.dim)("Sorry, I don't have anything to say about")} ${a}`,c=dict({project:`Scaffold a new Node.js project with ${_chalk.bold.yellow("Babel")}, ${_chalk.bold.cyan("ESLint")}, and ${_chalk.bold.magenta("Jest")}`,app:`Scaffold a new ${_chalk.bold.red("Marionette.js")} ${_chalk.bold.cyan("web application")} - basically a project with CSS, bundling, and stuff`,server:`Scaffold a new Express server with security baked in - ${_chalk.bold.yellow("WORK IN PROGRESS")}`,a11y:`Add automated ${_chalk.bold.cyan("accessibility")} testing`,babel:`Use next generation JavaScript, ${_chalk.bold.cyan("today!")}`,esdoc:`Generate ${_chalk.bold.cyan("documentation")} from your comments`,eslint:`Pluggable ${_chalk.bold.cyan("linting")} utility for JavaScript and JSX`,jest:`Delightful JavaScript ${_chalk.bold.cyan("Testing")} Framework with a focus on simplicity`,makefile:`Create a ${_chalk.bold.cyan("Makefile")} from your package.json, like ${_chalk.bold.magenta("magic!")}`,postcss:`Use ${_chalk.bold.cyan("future CSS")}, never write vendor prefixes again, and much much more!`,webpack:`${_chalk.bold.cyan("Bundle")} your assets`});return c.has(a)?c.get(a):b})(a)))},ErrorMessage=({info:a})=>_react.default.createElement(_ink.Box,{flexDirection:"column",marginBottom:1},_react.default.createElement(_inkBox.default,{borderColor:"yellow",margin:{left:1,top:1},padding:{left:1,right:1}},_react.default.createElement(_ink.Color,{yellow:!0},"(\u256F\xB0\u25A1 \xB0)\u256F \u253B\u2501\u253B arrrgh...")),_react.default.createElement(_ink.Box,{marginLeft:4},"\u21B3 ",_react.default.createElement(_ink.Color,{dim:!0},"Something went wrong...")),_react.default.createElement(_ink.Box,{marginLeft:6,marginTop:1},_react.default.createElement(_ink.Color,{dim:!0},_react.default.createElement(_ink.Box,null,a))));class ErrorBoundary extends _react.Component{constructor(a){super(a),this.state={info:"",error:{},hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(a,b){this.setState({error:a,info:b})}render(){const{error:a,hasError:b}=this.state,{children:c}=this.props;return b?_react.default.createElement(ErrorMessage,{error:a}):c}}const SubCommandSelect=({command:a,items:b,onSelect:c})=>{const[d,e]=(0,_react.useState)(b[0].value),f=`${_chalk.bold.yellow("CAUTION:")} tomo shall ${_chalk.bold.red("remove")} that which tomo would have ${_chalk.bold.green("added")}`;return _react.default.createElement(_ink.Box,{flexDirection:"column",paddingTop:1,paddingBottom:1,paddingLeft:1},"remove"===a?_react.default.createElement(_ink.Box,{marginBottom:1},f):_react.default.createElement(Description,{command:d}),_react.default.createElement(_inkSelectInput.default,{items:b,onSelect:c,onHighlight:a=>{e(a.value)},itemComponent:Item,indicatorComponent:Indicator}))},UnderConstruction=()=>_react.default.createElement(_ink.Box,{marginBottom:1},_react.default.createElement(_inkBox.default,{padding:{left:1,right:1},margin:{left:1,top:1}},_react.default.createElement(_ink.Color,{bold:!0,yellow:!0},"UNDER CONSTRUCTION"))),Warning=({callback:a,children:b})=>{const{setRawMode:c,stdin:d}=(0,_react.useContext)(_ink.StdinContext);return(0,_react.useEffect)(()=>(c&&c(!0),d.on("data",a),function(){d.removeListener("data",a),c&&c(!1)})),_react.default.createElement(_ink.Box,{flexDirection:"column",marginBottom:1},_react.default.createElement(_inkBox.default,{borderColor:"yellow",margin:{left:1,top:1},padding:{left:1,right:1}},_react.default.createElement(_ink.Color,{yellow:!0},"oops...")),_react.default.createElement(_ink.Box,{marginLeft:4},"\u21B3 ",b),_react.default.createElement(_ink.Box,{marginLeft:6,marginTop:1},_react.default.createElement(_ink.Color,{dim:!0},"Press "),_react.default.createElement(_ink.Text,{bold:!0},"ENTER"),_react.default.createElement(_ink.Color,{dim:!0}," to continue")))};exports.Warning=Warning;const OfflineWarning=()=>_react.default.createElement(_ink.Box,{flexDirection:"column",marginBottom:1},_react.default.createElement(_inkBox.default,{borderColor:"yellow",margin:{left:1,top:1},padding:{left:1,right:1}},_react.default.createElement(_ink.Color,{yellow:!0},"(\u2312_\u2312;) This is awkward...")),_react.default.createElement(_ink.Box,{marginLeft:4,flexDirection:"column"},_react.default.createElement(_ink.Box,null,"\u21B3 ",_react.default.createElement(_ink.Text,null,"...but you appear to be ",_react.default.createElement(_ink.Color,{bold:!0,red:!0},"offline"))),_react.default.createElement(_ink.Box,null,"\u21B3 ",_react.default.createElement(_ink.Text,null,"Please connect to the internet and ",_react.default.createElement(_ink.Color,{bold:!0,cyan:!0},"try again")))),_react.default.createElement(_ink.Box,{marginLeft:6,marginTop:1},_react.default.createElement(_ink.Color,{dim:!0},"No dependencies were installed")));/**
 * Add async tasks to a queue, handle completion with actions dispatched via dispatch function
 * @param {Object} data Data to be used for populating queue
 * @param {Queue} [data.queue={}] p-queue instance
 * @param {Object[]} [data.tasks=[]] Array of task objects
 * @param {function} [data.dispatch=()=>{}] Function to dispatch task completion (complete, skip, error) actions
 * @param {Object} [data.options={}] Options object to pass to task function
 * @return {undefined} Returns nothing (side effects only)
 */exports.OfflineWarning=OfflineWarning;function populateQueue(){return _populateQueue.apply(this,arguments)}/**
 * Task component
 * @param {Object} props Function component props
 * @param {boolean} props.isComplete Control display of check (true) or loading (false)
 * @param {boolean} props.isErrored Control display of x (true)
 * @param {boolean} props.isSkipped Control color of check - green (false) or dim (true)
 * @param {string} props.text Task text
 * @example
 * <Task text={'This task is done before it starts'} isComplete={true}></Task>
 * @return {ReactComponent} Task component
 */function _populateQueue(){return _populateQueue=(0,_asyncToGenerator2.default)(function*(a={queue:{},tasks:[],dispatch:()=>{},options:{skipInstall:!1}}){const{queue:b,tasks:c,dispatch:d,options:e}=a,{skipInstall:f}=e,g=f||(yield(0,_isOnline.default)());d({type:"status",payload:g?"online":"offline"});for(const[f,h]of c.entries()){const{condition:a,task:c}=h;try{(yield a((0,_objectSpread2.default)({},e,{isNotOffline:g})))?yield b.add(()=>c((0,_objectSpread2.default)({},e,{isNotOffline:g}))).then(()=>d({type:"complete",payload:f})).catch(()=>d({type:"error",payload:{index:f,title:"Failed to add task to queue",location:"task",details:h.text}})):d({type:"skipped",payload:f})}catch(a){d({type:"error",payload:{error:a,index:f,title:"Failed to test task conditions",location:"condition",details:h.text}})}}}),_populateQueue.apply(this,arguments)}const Task=({isComplete:a,isErrored:b,isPending:c,isSkipped:d,text:e})=>_react.default.createElement(_ink.Box,{flexDirection:"row",marginLeft:3},a&&_react.default.createElement(Check,{isSkipped:d}),b&&_react.default.createElement(X,null),c&&_react.default.createElement(Pending,null),_react.default.createElement(_ink.Text,null,_react.default.createElement(_ink.Color,{dim:a},e)));/**
 * Task list component
 * @param {Object} props Function component props
 * @param {string} props.command Command - new | create | add
 * @param {Object} props.options Command line flags (see help)
 * @param {string[]} props.terms Terms - eslint | babel | jest | postcss | docs
 * @example
 * <TaskList command={'add'} terms={'eslint'} options={{skipInstall: true}}></TaskList>
 * @return {ReactComponent} Task list component
 */exports.Task=Task;const TaskList=({command:a,options:b,terms:c,done:d})=>{const[e,f]=(0,_react.useReducer)((a,{type:b,payload:c})=>{const{completed:d,errors:e,skipped:f}=a,g=b=>assign({},a,b),h=dict({complete:()=>g({completed:[...d,c]}),skipped:()=>g({skipped:[...f,c]}),error:()=>g({errors:[...e,{payload:c}]}),status:()=>g({status:c})});return h.has(b)?h.get(b)():a},{completed:[],skipped:[],errors:[],status:"online"}),{completed:g,errors:h,skipped:i,status:j}=e,k=new _pQueue.default({concurrency:1}),l=c.map(b=>_commands.default[a][b]).flat(1),m=g.length+i.length===l.length,n=0<h.length,{debug:o,skipInstall:p}=b;return(0,_react.useEffect)(()=>{populateQueue({queue:k,tasks:l,options:b,dispatch:f})},[]),m&&(0,_lodash.isFunction)(d)&&d(),_react.default.createElement(ErrorBoundary,null,o&&_react.default.createElement(Debug,{data:{completed:g,errors:h,skipped:i,tasks:l,terms:c},title:"Tasklist data"}),"offline"===j&&!p&&_react.default.createElement(OfflineWarning,null),n&&_react.default.createElement(CommandError,{errors:h}),_react.default.createElement(_ink.Box,{flexDirection:"column",marginBottom:1},_react.default.createElement(_inkBox.default,{margin:{left:1,top:1},padding:{left:1,right:1},borderColor:m?"green":n?"red":"cyan",borderStyle:"round"},_react.default.createElement(_ink.Color,{bold:!0,white:!0},a," ",c.join(" "))),_react.default.createElement(_ink.Box,{flexDirection:"column",marginBottom:1},l.map(({optional:a,text:c},d)=>{const{completed:f,errors:g,skipped:h}=e,i=h.includes(d),j=f.includes(d)||i,k=g.map(a=>a.payload.index).includes(d),l=[j,i,k].every(a=>!a),m=(0,_lodash.isUndefined)(a)||(0,_lodash.isFunction)(a)&&a(b),n={isSkipped:i,isComplete:j,isErrored:k,isPending:l,text:c};return m?_react.default.createElement(_react.Fragment,{key:d},o&&_react.default.createElement(Debug,{data:n,title:`Data - task #${d}`}),_react.default.createElement(Task,{text:c,isSkipped:i,isComplete:j,isErrored:k,isPending:l})):_react.default.createElement(_react.Fragment,{key:d},o&&_react.default.createElement(Debug,{data:n,title:`Data - task #${d}`}),_react.default.createElement(_ink.Box,null))}))))};/**
 * Main tomo UI component
 * @param {Object} props Component props
 * @return {ReactComponent} Main tomo UI component
 */exports.TaskList=TaskList;class UI extends _react.Component{constructor(a){super(a);const{flags:b,input:c}=a,{ignoreWarnings:d}=b,[e,...f]=c,g=(0,_lodash.isString)(e),h=0<f.length,{intendedCommand:i,intendedTerms:j}=g?(0,_utils.getIntendedInput)(_commands.default,e,f):{},k=(e!==i||j.map((a,b)=>a!==f[b]).some(Boolean))&&!d;this.state={hasTerms:h,hasCommand:g,showWarning:k,intendedTerms:j,intendedCommand:i},this.updateWarning=this.updateWarning.bind(this),this.updateTerms=this.updateTerms.bind(this)}render(){const{done:a,flags:b}=this.props,{hasCommand:c,hasTerms:d,intendedCommand:e,intendedTerms:f,showWarning:g}=this.state,h=c?Object.keys(_commands.default[e]):[],i=c?h.map(a=>({label:a,value:a})):[];return _react.default.createElement(ErrorBoundary,null,g?_react.default.createElement(Warning,{callback:this.updateWarning},_react.default.createElement(_ink.Text,null,"Did you mean ",_react.default.createElement(_ink.Color,{bold:!0,green:!0},e," ",f.join(" ")),"?")):c&&d?_react.default.createElement(TaskList,{command:e,terms:f,options:b,done:a}):c?_react.default.createElement(SubCommandSelect,{command:e,items:i,onSelect:this.updateTerms}):_react.default.createElement(UnderConstruction,null))}/**
     * Callback function for warning component
     * @param {string} data Character data from stdin
     * @return {undefined} Returns nothing
     */updateWarning(a){"\r"==a+""?this.setState({showWarning:!1}):process.exit(0)}/**
     * @param {Object} args Function options
     * @param {string} args.value Intended term
     * @return {undefined} Returns nothing
     */updateTerms({value:a}){this.setState({hasTerms:!0,intendedTerms:[a]})}}Check.propTypes={isSkipped:_propTypes.default.bool},Check.defaultProps={isSkipped:!1},Debug.propTypes={data:_propTypes.default.any,title:_propTypes.default.string},Description.propTypes={command:_propTypes.default.string},SubCommandSelect.propTypes={command:_propTypes.default.string,items:_propTypes.default.arrayOf(_propTypes.default.object),onSelect:_propTypes.default.func},Indicator.propTypes={isSelected:_propTypes.default.bool},Indicator.defaultProps={isSelected:!1},Item.propTypes={isSelected:_propTypes.default.bool,label:_propTypes.default.string.isRequired},Item.defaultProps={isSelected:!1},ErrorMessage.propTypes={info:_propTypes.default.string},ErrorBoundary.propTypes={children:_propTypes.default.node},Task.propTypes={isComplete:_propTypes.default.bool,isErrored:_propTypes.default.bool,isSkipped:_propTypes.default.bool,isPending:_propTypes.default.bool,text:_propTypes.default.string},Task.defaultProps={isComplete:!1,isErrored:!1,isSkipped:!1,isPending:!1,text:"task description"},TaskList.propTypes={command:_propTypes.default.string,options:_propTypes.default.any,terms:_propTypes.default.arrayOf(_propTypes.default.string),done:_propTypes.default.func},TaskList.defaultProps={command:"",options:{skipInstall:!1},terms:[]},Warning.propTypes={callback:_propTypes.default.func,children:_propTypes.default.node},UI.propTypes={input:_propTypes.default.array,flags:_propTypes.default.object,done:_propTypes.default.func},UI.defaultProps={input:[],flags:{}};var _default=UI;exports.default=_default;