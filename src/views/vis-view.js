import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import 'dile-modal'

class VisView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Vis"
    this.debug = false
    this.config = {}
    // create an array with nodes
    var nodes = new vis.DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5},
      {from: 3, to: 3}
    ]);
    this.data = {
      nodes: nodes,
      edges: edges
    };

  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <!--  <link href="css/fontawesome/css/all.css" rel="stylesheet"> -->
    <link href="css/vis-network.min.css" rel="stylesheet">
    <style>
    #mynetwork {
      width: 600px;
      height: 400px;
      border: 1px solid lightgray;
    }
    #operation {
      font-size:28px;
    }
    #nodePopUp {
      display:none;

      z-index:299;
      width:250px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    body {
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
    h1 {
      font-weight: 300;
    }
    p {
      margin-top: 0;
    }
    #myModal2 {
      --dile-modal-height: 300px;
    }
    #myModalCustomized {
      --dile-modal-border-radius: 0;
      --dile-modal-content-background-color: #303030;
      --dile-modal-width: 200px;
      --dile-modal-min-width: 100px;
      text-align: center;
      --dile-modal-content-shadow-color: #ddd;
      --dile-modal-background-color: #fff;
    }
    #myModalCustomized p {
      color: #f66;
      font-size: 0.9em;
      margin: 0 0 10px;
      text-transform: uppercase;
    }

    #myModal2 {
      --dile-modal-close-icon-top: 8px;
      --dile-modal-close-icon-right: 15px;
    }
    #edge-popUp {
      display:none;

      z-index:299;
      width:250px;
      height:90px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    dile-modal {
     --dile-modal-background-color: rgba(130, 230, 230, 0.5);
     --dile-modal-height: 300px;
     --dile-modal-border-radius: 5px;
   }
   p {
     margin-top: 0;
   }
    </style>
    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    config : ${JSON.stringify(this.config)}<br>
    </div>

    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element

    <div id="mynetwork">Network</div>
    </div>

    <dile-modal id="myModal">
      <p>
        Lorem, ipsum dolor sit...
      </p>
    </dile-modal>

    <h1>Modal Demo</h1>
    <button @click="${this.openbutton}">Open a modal box</button>
    <button @click="${this.openbutton2}">Open a modal box with large content, fixed height and close icon</button>
    <button @click="${this.openbutton3}">Open a modal box customized</button>

    <dile-modal id="myModal">
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum omnis deserunt, eius ratione quia quaerat odit. Quae ab esse minima alias sit. Totam dolor rem illo molestias sunt ducimus eos?
      </p>
    </dile-modal>

    <dile-modal id="myModal2" showcloseicon>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum omnis deserunt, eius ratione quia quaerat odit. Quae ab esse minima alias sit. Totam dolor rem illo molestias sunt ducimus eos?
      </p>
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
        <li>item 5</li>
      </ul>
      <p>Quo nihil quidem earum magnam libero tempore voluptatum animi? Ad commodi delectus sequi, beatae, eaque inventore porro nesciunt quae sint sunt rerum eveniet ducimus. Repellat ullam atque minus perspiciatis a.</p>
      <p>Ipsam voluptatibus voluptas dolorem, ea doloribus quasi neque voluptates nostrum ab sunt nobis perspiciatis impedit voluptatum. Sunt nam earum modi officia culpa facilis repellendus, ducimus obcaecati similique possimus totam corporis.</p>
    </dile-modal>

    <dile-modal id="myModalCustomized">
      <p>This action is not permited! #JOKE</p>
      <button id="acceptButon">Accept!</button>
    </dile-modal>

    <div id="nodePopUp">
    <span id="node-operation">node</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>id</td><td><input id="node-id" value="new value" /></td>
    </tr>
    <tr>
    <td>label</td><td><input id="node-label" value="new value" /></td>
    </tr>
    </table>
    <input type="button" value="save" id="node-saveButton" />
    <input type="button" value="cancel" id="node-cancelButton" />
    </div>

    <div id="edge-popUp">
    <span id="edge-operation">edge</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>label</td><td><input id="edge-label" value="new value" /></td>
    </tr></table>
    <input type="button" value="save" id="edge-saveButton" />
    <input type="button" value="cancel" id="edge-cancelButton" />
    </div>


    `;
  }

  openbutton(e){
    console.log(e)
    let modalElement = this.shadowRoot.getElementById('myModal');
  //  document.getElementById('openbutton3').addEventListener('click', () => {
      modalElement.open();
  //  });
  }
  openbutton2(e){
    console.log(e)
    let modalElement2 = this.shadowRoot.getElementById('myModal2');
  //  document.getElementById('openbutton3').addEventListener('click', () => {
      modalElement2.open();
  //  });
  }

  openbutton3(e){
    console.log(e)
    let modalElement3 = this.shadowRoot.getElementById('myModalCustomized');
  //  document.getElementById('openbutton3').addEventListener('click', () => {
      modalElement3.open();
  //  });
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    this.init()
    //https://dile-modal.polydile.com/?path=/story/dile-modal--modal-box-openend
  //this.shadowRoot.getElementById("myModal").open();
  }

  init(){
    let app = this
    // create a network
    var container = this.shadowRoot.getElementById('mynetwork');
    var options = {
      //  layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
      //  locale: val || "en", // app.shadowRoot.getElementById('locale').value,
      interaction: {
        navigationButtons: true,
        //  keyboard: true, // incompatible avec le déplacement par flèches dans le champ input
        multiselect: true
      },
      edges:{
        arrows: {
          to:     {enabled: true, scaleFactor:1, type:'arrow'}
        },
        color:{
          inherit:'both',
          highlight: '#000000',
          color: '#2B7CE9'
        }
      },
      nodes:{
        color: {
          highlight: {border: '#000000', background:'#FFFFFF'}
        }
      },
      manipulation: {

        addNode: function (data, callback) {
          // filling in the popup DOM elements
          //  app.shadowRoot.getElementById('node-operation').innerHTML = "Ajouter un noeud ";
          //  data.label="";
          app.addNode(data, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          //  app.shadowRoot.getElementById('node-operation').innerHTML = "Editer un noeud ";
          app.editNode(data, callback);
        },
        addEdge: function (data, callback) {
          // filling in the popup DOM elements
          //  app.shadowRoot.getElementById('node-operation').innerHTML = "Editer un noeud ";
          app.addEdge(data, callback);
        },
        editEdge: function (data, callback) {
          // filling in the popup DOM elements
          //  app.shadowRoot.getElementById('node-operation').innerHTML = "Editer un noeud ";
          app.editEdge(data, callback);
        },
        /*addEdge: function (data, callback) {
        if (data.from == data.to) {
        var r = confirm("Etes-vous certain de vouloir connecter le noeud sur lui-même?");
        if (r != true) {
        callback(null);
        return;
      }
    }
    app.shadowRoot.getElementById('edge-operation').innerHTML = "Ajouter un lien";
    app.editEdgeWithoutDrag(data, callback);
  },
  editEdge: {
  editWithoutDrag: function(data, callback) {
  app.shadowRoot.getElementById('edge-operation').innerHTML = "Editer un lien";
  app.editEdgeWithoutDrag(data,callback);
}
}*/
}
,
physics:{
  enabled: true,
  barnesHut: {
    gravitationalConstant: -1,
    centralGravity: 0.3,
    springLength: 95,
    springConstant: 0.04,
    damping: 0.09,
    avoidOverlap: 1
  },
  forceAtlas2Based: {
    gravitationalConstant: -50,
    centralGravity: 0.01,
    springConstant: 0.08,
    springLength: 100,
    damping: 0.4,
    avoidOverlap: 0
  },
  /*    repulsion: {
  centralGravity: centralGravityValueDefault,  //0.001, //0.001 ? A quoi sert cette valeur ?
  springLength: springLengthValueDefault,   // 220, //220 (//200 //300)
  springConstant: springConstantValueDefault, //0.01, //0.01
  nodeDistance:  nodeDistanceValueDefault, //150, //100 //350
  damping: dampingValueDefault, ///0.08

},*/
hierarchicalRepulsion: {
  centralGravity: 0.0,
  springLength: 100,
  springConstant: 0.01,
  nodeDistance: 120,
  damping: 0.09
},
maxVelocity: 500, //50
minVelocity: 1, //0.1
solver: 'repulsion',
stabilization: {
  enabled: true,
  iterations: 1000,
  updateInterval: 100,
  onlyDynamicEdges: false//,
  //  fit: true
},
timestep: 0.5,
adaptiveTimestep: true
}
};

this.network = new vis.Network(container, this.data, options);

}


addNode(data, cb){
  console.log(data)
  data.label = 'hello world';
  data.shape = 'star'
  cb(data)
}

editNode(data, cb){
  console.log(data)
  data.label = 'hello world';
  data.shape = 'star'
  cb(data)
}

addEdge(data, cb){
  console.log(data)
  data.label = 'hello world';
  data.shape = 'star'
  cb(data)
}

editEdge(data, cb){
  console.log(data)
  data.label = 'hello world';
  data.shape = 'star'
  cb(data)
}








////////////



configChanged(config){
  this.config = config
  console.log(this.config)
}


editNode1(data, callback){
  console.log("open",data, callback)
  //  var data = params.data;
  //var cancelAction = params.cancelAction ;
  //  var callback = params.callback ;
  this.shadowRoot.getElementById('node-id').value = data.id || "";
  this.shadowRoot.getElementById('node-label').value = data.label;
  //  this.shadowRoot.getElementById('node-shape').value = data.shape || "ellipse";
  this.shadowRoot.getElementById('node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
  //  this.shadowRoot.getElementById('node-cancelButton').onclick = this.cancelAction.bind(this, callback);
  this.shadowRoot.getElementById('nodePopUp').style.display = 'block';
  this.shadowRoot.getElementById('node-label').onkeyup = this.nodeNameChanged.bind(this, data, callback);
}

nodeNameChanged(event,data, callback) {
  if(event.key === 'Enter') {
    event.preventDefault();
    //  document.getElementById("valider").click();
    this.saveNodeData(data, callback)
  }
}

edgeNameChanged(event,data, callback) {
  if(event.key === 'Enter') {
    event.preventDefault();
    //  document.getElementById("valider").click();
    this.saveEdgeData(data, callback)
  }
}
saveNodeData1(data, callback) {
  data.label = this.shadowRoot.getElementById('node-label').value;
  /*  console.log(this.shadowRoot.getElementById('node-shape'))
  data.shape = this.shadowRoot.getElementById('node-shape').value;
  console.log(data.shape)
  data.color = {};
  data.color.background = this.shadowRoot.getElementById('colpicbody').value;
  data.color.border =  this.shadowRoot.getElementById('colpicborder').value;
  this.shadowRoot.getElementById('bodycolorpicker').value = this.shadowRoot.getElementById('colpicbody').value;
  this.shadowRoot.getElementById('bordercolorpicker').value = this.shadowRoot.getElementById('colpicborder').value;
  var image_url = this.shadowRoot.getElementById('node-image-url').value || "";
  if (data.shape == "image" || data.shape == "circularImage" && image_url.length > 0){
  data.image = image_url;
}
*/
console.log(data)
//  this.fitAndFocus(data.id)
this.clearNodePopUp(this);
callback(data);
}


// Callback passed as parameter is ignored
clearNodePopUp1(app) {
  app.shadowRoot.getElementById('node-saveButton').onclick = null;
  app.shadowRoot.getElementById('node-cancelButton').onclick = null;
  app.shadowRoot.getElementById('nodePopUp').style.display = 'none';
  app.shadowRoot.getElementById('node-label').onkeyup = null;
}

cancelNodeEdit1(callback) {
  this.clearNodePopUp();
  callback(null);
}

editEdgeWithoutDrag1(data, callback) {
  //var data = params.data
  //var callback = params.callback
  // filling in the popup DOM elements
  this.shadowRoot.getElementById('edge-label').value = data.label || "";
  this.shadowRoot.getElementById('edge-saveButton').onclick = this.saveEdgeData.bind(this, data, callback);
  this.shadowRoot.getElementById('edge-cancelButton').onclick = this.cancelEdgeEdit.bind(this,callback);
  this.shadowRoot.getElementById('edge-popUp').style.display = 'block';
  this.shadowRoot.getElementById('edge-label').onkeyup = this.edgeNameChanged.bind(this, data, callback);
}

clearEdgePopUp1() {
  this.shadowRoot.getElementById('edge-saveButton').onclick = null;
  this.shadowRoot.getElementById('edge-cancelButton').onclick = null;
  this.shadowRoot.getElementById('edge-label').onkeyup = null;
  this.shadowRoot.getElementById('edge-popUp').style.display = 'none';

}

cancelEdgeEdit1(callback) {
  this.clearEdgePopUp();
  callback(null);
}

saveEdgeData1(data, callback) {
  if (typeof data.to === 'object')
  data.to = data.to.id
  if (typeof data.from === 'object')
  data.from = data.from.id
  data.label = this.shadowRoot.getElementById('edge-label').value;
  data.color = {};
  data.color.inherit='both';
  this.clearEdgePopUp();
  callback(data);
}

clickHandler(event) {
  this.count++
  //console.log(event.target);
  console.log(this.agent)
  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
}


/* function setDefaultLocale() {
var defaultLocal = navigator.language;
var select = app.shadowRoot.getElementById('locale');
select.selectedIndex = 0; // set fallback value
for (var i = 0, j = select.options.length; i < j; ++i) {
if (select.options[i].getAttribute('value') === defaultLocal) {
select.selectedIndex = i;
break;
}
}
}

function destroy() {
if (network !== null) {
network.destroy();
network = null;
}
}

function draw() {
destroy();
nodes = [];
edges = [];

// create a network
var container = app.shadowRoot.getElementById('mynetwork');
var options = {
layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
locale: app.shadowRoot.getElementById('locale').value,
manipulation: {
addNode: function (data, callback) {
// filling in the popup DOM elements
app.shadowRoot.getElementById('node-operation').innerHTML = "Add Node";
editNode(data, clearNodePopUp, callback);
},
editNode: function (data, callback) {
// filling in the popup DOM elements
app.shadowRoot.getElementById('node-operation').innerHTML = "Edit Node";
editNode(data, cancelNodeEdit, callback);
},
addEdge: function (data, callback) {
if (data.from == data.to) {
var r = confirm("Do you want to connect the node to itself?");
if (r != true) {
callback(null);
return;
}
}
app.shadowRoot.getElementById('edge-operation').innerHTML = "Add Edge";
editEdgeWithoutDrag(data, callback);
},
editEdge: {
editWithoutDrag: function(data, callback) {
app.shadowRoot.getElementById('edge-operation').innerHTML = "Edit Edge";
editEdgeWithoutDrag(data,callback);
}
}
}
};
network = new vis.Network(container, data, options);
}

function editNode(data, cancelAction, callback) {
app.shadowRoot.getElementById('node-label').value = data.label;
app.shadowRoot.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
app.shadowRoot.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
app.shadowRoot.getElementById('node-popUp').style.display = 'block';
}

// Callback passed as parameter is ignored
function clearNodePopUp() {
app.shadowRoot.getElementById('node-saveButton').onclick = null;
app.shadowRoot.getElementById('node-cancelButton').onclick = null;
app.shadowRoot.getElementById('node-popUp').style.display = 'none';
}

function cancelNodeEdit(callback) {
clearNodePopUp();
callback(null);
}

function saveNodeData(data, callback) {
data.label = app.shadowRoot.getElementById('node-label').value;
clearNodePopUp();
callback(data);
}

function editEdgeWithoutDrag(data, callback) {
// filling in the popup DOM elements
app.shadowRoot.getElementById('edge-label').value = data.label;
app.shadowRoot.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
app.shadowRoot.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
app.shadowRoot.getElementById('edge-popUp').style.display = 'block';
}

function clearEdgePopUp() {
app.shadowRoot.getElementById('edge-saveButton').onclick = null;
app.shadowRoot.getElementById('edge-cancelButton').onclick = null;
app.shadowRoot.getElementById('edge-popUp').style.display = 'none';
}

function cancelEdgeEdit(callback) {
clearEdgePopUp();
callback(null);
}

function saveEdgeData(data, callback) {
if (typeof data.to === 'object')
data.to = data.to.id
if (typeof data.from === 'object')
data.from = data.from.id
data.label = app.shadowRoot.getElementById('edge-label').value;
clearEdgePopUp();
callback(data);
}

function init() {
setDefaultLocale();
draw();
}
*/

}

customElements.define('vis-view', VisView);
