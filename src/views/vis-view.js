import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

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
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/vis-network.min.css" rel="stylesheet">
    <style>
    #mynetwork {
      width: 600px;
      height: 400px;
      border: 1px solid lightgray;
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
    `;
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
  }

  init(){
    let app = this
    // create a network
    var container = this.shadowRoot.getElementById('mynetwork');
    var options = {
      //  layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
      //  locale: val || "en", // document.getElementById('locale').value,
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
          document.getElementById('node-operation').innerHTML = "Ajouter un noeud ";
          data.label="";
          editNode(data, clearNodePopUp, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          document.getElementById('node-operation').innerHTML = "Editer un noeud ";
          editNode(data, cancelNodeEdit, callback);
        },
        addEdge: function (data, callback) {
          if (data.from == data.to) {
            var r = confirm("Etes-vous certain de vouloir connecter le noeud sur lui-même?");
            if (r != true) {
              callback(null);
              return;
            }
          }
          document.getElementById('edge-operation').innerHTML = "Ajouter un lien";
          editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
          editWithoutDrag: function(data, callback) {
            document.getElementById('edge-operation').innerHTML = "Editer un lien";
            editEdgeWithoutDrag(data,callback);
          }
        }
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

  var options2 = {
    manipulation: {
      enabled: true,
      initiallyActive: false,
      addNode: true,
      addEdge: true,
      //  editNode: undefined,
      editEdge: true,
      deleteNode: true,
      deleteEdge: true,
      controlNodeStyle:{
        // all node options are valid.
      }
    }
  }

  var options1 = {
    //  layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
    //  locale: document.getElementById('locale').value,
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        app.shadowRoot.getElementById('node-operation').innerHTML = "Add Node";
        app.editNode(data, app.clearNodePopUp, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        app.shadowRoot.getElementById('node-operation').innerHTML = "Edit Node";
        app.editNode(data, app.cancelNodeEdit, callback);
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        app.shadowRootgetElementById('edge-operation').innerHTML = "Add Edge";
        app.editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
          app.shadowRootgetElementById('edge-operation').innerHTML = "Edit Edge";
          app.editEdgeWithoutDrag(data,callback);
        }
      }
    }
  };
  this.network = new vis.Network(container, this.data, options);

}

configChanged(config){
  this.config = config
  console.log(this.config)
}

/* function setDefaultLocale() {
var defaultLocal = navigator.language;
var select = document.getElementById('locale');
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
var container = document.getElementById('mynetwork');
var options = {
layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
locale: document.getElementById('locale').value,
manipulation: {
addNode: function (data, callback) {
// filling in the popup DOM elements
document.getElementById('node-operation').innerHTML = "Add Node";
editNode(data, clearNodePopUp, callback);
},
editNode: function (data, callback) {
// filling in the popup DOM elements
document.getElementById('node-operation').innerHTML = "Edit Node";
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
document.getElementById('edge-operation').innerHTML = "Add Edge";
editEdgeWithoutDrag(data, callback);
},
editEdge: {
editWithoutDrag: function(data, callback) {
document.getElementById('edge-operation').innerHTML = "Edit Edge";
editEdgeWithoutDrag(data,callback);
}
}
}
};
network = new vis.Network(container, data, options);
}

function editNode(data, cancelAction, callback) {
document.getElementById('node-label').value = data.label;
document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
document.getElementById('node-popUp').style.display = 'block';
}

// Callback passed as parameter is ignored
function clearNodePopUp() {
document.getElementById('node-saveButton').onclick = null;
document.getElementById('node-cancelButton').onclick = null;
document.getElementById('node-popUp').style.display = 'none';
}

function cancelNodeEdit(callback) {
clearNodePopUp();
callback(null);
}

function saveNodeData(data, callback) {
data.label = document.getElementById('node-label').value;
clearNodePopUp();
callback(data);
}

function editEdgeWithoutDrag(data, callback) {
// filling in the popup DOM elements
document.getElementById('edge-label').value = data.label;
document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
document.getElementById('edge-popUp').style.display = 'block';
}

function clearEdgePopUp() {
document.getElementById('edge-saveButton').onclick = null;
document.getElementById('edge-cancelButton').onclick = null;
document.getElementById('edge-popUp').style.display = 'none';
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
data.label = document.getElementById('edge-label').value;
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
