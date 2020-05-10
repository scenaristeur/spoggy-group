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
    let face = "'Font Awesome 5 Free'"
    this.name = "Vis"
    this.debug = true
    this.config = {}
    var nodes = new vis.DataSet([
      {
        id: 1,
        label: 'User 1',
        group: 'users'
      }, {
        id: 2,
        label: 'User 2',
        group: 'users'
      }, {
        id: 3,
        label: 'Usergroup 1',
        group: 'usergroups'
      }, {
        id: 4,
        label: 'Usergroup 2',
        group: 'usergroups'
      }, {
        id: 5,
        label: 'Organisation 1',
        shape: 'icon',
        icon: {
          face: face,
          weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
          code: '\uf1ad',
          size: 50,
          color: '#f0a30a'
        }
      }
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
    <link href="css/vis-network.min.css" rel="stylesheet">
    <style>
    #mynetwork {
      max-width: 500px; /* 800px */
      min-width: 320px;
      height: 600px;
      border: 1px solid lightgray;
      background: linear-gradient(to bottom, rgba(215, 215, 255), rgba(250, 250, 170))
    }
    </style>
    <button class="btn btn-primary" @click="${this.new}">New</button>
    <div id="mynetwork">Network</div>
    `;
  }

  new(){
    this.data.nodes.clear()
    //this.data.edges.clear()
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
    let face = "'Font Awesome 5 Free'"
    var container = this.shadowRoot.getElementById('mynetwork');
    let  centralGravityValueDefault = 0.001//, //0.001 ? A quoi sert cette valeur ?
    let springLengthValueDefault = 220// //220 (//200 //300)
      let  springConstantValueDefault = 0.01//, //0.01
      let nodeDistanceValueDefault = 150//, //100 //350
      let dampingValueDefault = 0.08

      var options = {

        //  layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
        locale: navigator.language || "en", // app.shadowRoot.getElementById('locale').value,
        interaction: {
          navigationButtons: true,
          //  keyboard: true, // incompatible avec le déplacement par flèches dans le champ input
          multiselect: true
        },
        edges:{
          arrows: {
            to:     {enabled: true, scaleFactor:1, type:'arrow'}
          },
          width: 2,
          shadow:true,
          color:{
            inherit:'both',
            highlight: '#000000',
            color: '#2B7CE9'
          }
        },
        nodes: {
          shape: 'dot',
          size: 30,
          font: {
            size: 32
          },
          borderWidth: 2,
          shadow:true,
          color: {
            highlight: {border: '#000000', background:'#FFFFFF'}
          }
        },
        groups: {
                 usergroups: {
                   shape: 'icon',
                   icon: {
                     face: face,
                    weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
                     code: '\uf0c0',
                     size: 50,
                     color: '#57169a'
                   }
                 },
                 users: {
                   shape: 'icon',
                   icon: {
                     face: face,
                    // weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
                     code: '\uf007',
                     size: 50,
                     color: '#aa00ff'
                   }
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
  repulsion: {
    centralGravity: centralGravityValueDefault,  //0.001, //0.001 ? A quoi sert cette valeur ?
    springLength: springLengthValueDefault,   // 220, //220 (//200 //300)
      springConstant: springConstantValueDefault, //0.01, //0.01
      nodeDistance:  nodeDistanceValueDefault, //150, //100 //350
      damping: dampingValueDefault, ///0.08
    },
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
  this.agent.send("VisTool", {action: "changeTool", params: {data: data, tool: "editNode", callback: cb}})
  //  cb(data)
}

editNode(data, cb){
  console.log(data)
  this.agent.send("VisTool", {action: "changeTool", params: {data: data, tool: "editNode", callback: cb}})
  //  cb(data)
}

addEdge(data, cb){
  console.log(data)
  data.label = 'hello world';
  data.shape = 'star'
  this.agent.send("VisTool", {action: "changeTool", params: {data: data, tool: "addEdge", callback: cb}})
  //  cb(data)
}

editEdge(data, cb){
  console.log(data)
  data.label = 'hello world';
  data.shape = 'star'
  this.agent.send("VisTool", {action: "changeTool", params: {data: data, tool: "editEdge", callback: cb}})
  //  cb(data)
}

configChanged(config){
  this.config = config
  console.log(this.config)
}

}

customElements.define('vis-view', VisView);
