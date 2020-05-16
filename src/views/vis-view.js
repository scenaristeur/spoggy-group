import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
// import / export, voir https://github.com/scenaristeur/spoggy-simple/blob/a9c73eec43e37c736fef656a72c948dd1c453886/js/import-export.js

class VisView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      selected_nodes: {type: Array},
      selected_edges: {type: Array}
    };
  }

  constructor() {
    super();
    let face = "'Font Awesome 5 Free'"
    this.name = "Vis"
    this.debug = true
    this.config = {}
    this.selected_nodes = []
    this.selected_edges = []
    var nodes = new vis.DataSet([
      {
        id: 1,
        label: 'John',
        group: 'users'
      }, {
        id: 2,
        label: 'Mike',
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
        label: 'My Oranization',
        group: 'organizations'
      },
      {
        id: 6,
        label: 'Developer',
        group: 'roles'
      },
      {
        id: 7,
        label: 'We must develop a cool GUI for Spoggy !',
        group: 'tensions'
      },
      {
        id: 8,
        label: 'It is not easy to deal with LinkedData',
        group: 'whatis' // what is
      },
      {
        id: 9,
        label: 'We can use Visjs to provide a simple way to interact with LinkedData.',
        group: 'whatsb' // what should be
      },
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
      {from: 1, to: 3, label: "memberOf", title: "org:memberOf"},
      {from: 1, to: 2, label: "friend", title: "foaf:friend"},
      {from: 2, to: 4, label: "memberOf", title: "org:memberOf"},
      {from: 2, to: 5, label: "memberOf", title: "org:memberOf"},
      {from: 5, to: 4, label: "hasUnit", title: "org:hasUnit"},
      {from: 1, to: 7, label: "submit", title: "as:submit"},
      {from: 2, to: 6, label: "takeRole", title: "takeRole"},
      {from: 7, to: 8, label: "whatIs", title: "whatIs"},
      {from: 7, to: 9, label: "whatShouldBe", title: "whatShouldBe"},
    ]);
    this.data = {
      nodes: nodes,
      edges: edges
    };
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
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

    table.legend_table {
      font-size: 11px;
      border-width:1px;
      border-color:#d3d3d3;
      border-style:solid;
    }
    table.legend_table,td {
      border-width:1px;
      border-color:#d3d3d3;
      border-style:solid;
      padding: 2px;
    }
    div.table_content {
      width:80px;
      text-align:center;
    }
    div.table_description {
      width:100px;
    }


    #operation {
      font-size:28px;
    }
    #node-popUp {
      display:none;
      position:absolute;
      top:350px;
      /*  left:170px; */
      z-index:299;
      width:350px;
      height:150px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    #edge-popUp {
      display:none;
      position:absolute;
      top:350px;
      /*  left:170px; */
      z-index:299;
      width:350px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    </style>

    <div id="node-popUp">
    <span id="node-operation">node</span> <br>
    <table style="margin:auto;">
    <!--  <tr>
    <td>id</td><td><input id="node-id" value="new value" /></td>
    </tr>-->
    <tr>
    <td>label</td><td><input id="node-label" value="" /></td>
    </tr>
    </table>
    <input type="button" value="save" id="node-saveButton" />
    <input type="button" value="cancel" id="node-cancelButton" />
    </div>

    <div id="edge-popUp">
    <span id="edge-operation">edge</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>label</td><td><input id="edge-label" value="" /></td>
    </tr></table>
    <input type="button" value="save" id="edge-saveButton" />
    <input type="button" value="cancel" id="edge-cancelButton" />
    </div>





    <div class="row">
    <div>
    <div id="mynetwork">Network</div>
    </div>
    <div class="col">
    <button class="btn btn-primary" @click="${this.clear}">clear</button>
    <login-element name="Login"></login-element>
    <input-view name="Input"></input-view>

    <div ?hidden="${this.selected_nodes.length == 0}">
    <hr>
    <b>${this.selected_nodes.length} nodes.</b>
    <hr>
    ${this.selected_nodes.map((n, i) =>
      html`
      <node-view name="${'Node_'+i}" .node="${n}"></node-view>
      `
    )}
    </div>

    <div ?hidden="${this.selected_edges.length == 0}">
    <hr>
    <b>${this.selected_edges.length} edges.</b>
    <hr>
    ${this.selected_edges.map((e, i) =>
      html`
      <edge-view name="${'Edge_'+i}" .edge="${e}"></edge-view>
      `
    )}
    </div>

    <browser-view name="Browser"></browser-view>


    </div>
    </div>
    `;
  }

  clear(){
    this.data.nodes.clear()
    this.data.edges.clear()
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
          case "nodeUpdate":
          app.nodeUpdate(message.node)
          break;
          case "edgeUpdate":
          app.edgeUpdate(message.edge)
          break;
          case "triplesChanged":
          app.triplesChanged(message.triples)
          break;
          case "addTriple":
          app.addTriple(message.triple)
          break;
          case "clear":
          app.clear()
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    this.init()
  }

  addTriple(t){
    // from input-view
    console.log(t)
    let n_sub = {id: t.subject, label: this.localName(t.subject), title: t.subject}
    this.addNodeIfNotExist(n_sub)
    let n_obj = {id: t.object, label: this.localName(t.object), title: t.object}
    this.addNodeIfNotExist(n_obj)
    let edge = {from: n_sub.id, to: n_obj.id, label: this.localName(t.predicate), title: t.predicate}
    //  this.network.body.data.edges.update(edge)
    this.addEdgeIfNotExist(edge)
  }


  triplesChanged(triples){
    //from tripledoc in browser-view
    let app = this
    var clear = confirm("Do you want to clear the network ?");
    clear ==  true ? this.clear() : ""

    if (triples.length != 0){
      triples.forEach((t, i) => {
        let n_sub = {id: t.subject.id, label: app.localName(t.subject.id), title: t.subject.id}
        app.addNodeIfNotExist(n_sub)
        let n_obj = {id: t.object.id, label: app.localName(t.object.id), title: t.object.id}
        app.addNodeIfNotExist(n_obj)
        let edge = {from: n_sub.id, to: n_obj.id, label: app.localName(t.predicate.id), title: t.predicate.id}
        /*  app.network.body.data.edges.update(edge)*/
        this.addEdgeIfNotExist(edge)
      });

    }else{
      alert("this file does not contain any triple.")
    }

  }


  localName(strPromise){
    let str = `${strPromise}`
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }

  nodeUpdate(node){
    //  console.log(node)
    this.network.body.data.nodes.update(node)
  }

  edgeUpdate(edge){
    console.log(edge)
    this.network.body.data.edges.update(edge)
  }

  addEdgeIfNotExist (edge){
    let id = ""
    //  console.log("recherche "+id_sujet+" "+id_objet+" "+propriete)
    var items = this.network.body.data.edges.get({
      filter: function (item) {
        return item.from == edge.from && item.to == edge.to && item.label == edge.label;
      }
    });
    if (items.length > 0){
      id = items[0].id;
      // must update the edge ?
      console.log("trouvé "+id);

    }
    //else create node and get id
    else{
      id = this.network.body.data.edges.add(edge);
      console.log("creation "+id);
    }
  }


  addNodeIfNotExist(data){
    let network = this.network
    var existNode = false;
    //console.log(data);
    var nodeId;
    try{
      existNode = network.body.data.nodes.get({
        filter: function(n){
          return (n.id == data.id || (n.label == data.label)); //  || n.title == data.label
        }
      });
      //console.log(existNode);
      if (existNode.length == 0){
        //  console.log("n'existe pas")
        nodeId =   network.body.data.nodes.add(data)[0];
      }else{
        //  console.log("existe")
        delete data.x;
        delete data.y
        nodeId =  network.body.data.nodes.update(data)[0];
      }
    }
    catch (err){
      console.log(err);
    }
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

      let options = {
        locale: navigator.language.slice(0, 2) || "en",
        interaction: {
          navigationButtons: true,
          //  keyboard: true, // incompatible avec le déplacement par flèches dans le champ input
          multiselect: true
        },
        edges:{
          arrows: {
            to:     {enabled: true, scaleFactor:1, type:'arrow'}
          },
          font: {
            size: 24
          },
          width: 2,
          shadow:true,
          color:{
            inherit:'both',
            //  highlight: '#000000',
            //  color: '#2B7CE9'
          }
        },
        nodes: {
          shape: 'dot',
          size: 30,
          font: {
            size: 24
          },
          borderWidth: 2,
          shadow:true,
          color: {
            highlight: {border: '#000000', background:'#FFFFFF'}
          }
        },
        groups: {
          organizations: {
            shape: 'icon',
            icon: {
              face: face,
              weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
              code: '\uf1ad',
              size: 50,
              color: '#f00a57'
            }
          },
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
              weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
              code: '\uf007',
              size: 50,
              color: '#aa00ff'
            }
          },
          roles: {
            shape: 'icon',
            icon: {
              face: face,
              weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
              code: '\uf8c1',
              size: 50,
              color: '#0af0a3'
            }
          },
          tensions: {
            shape: 'icon',
            icon: {
              face: face,
              weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
              code: '\uf0e7',
              size: 50,
              color: '#f0a30a'
            }
          },
          whatis: {
            shape: 'icon',
            icon: {
              face: face,
              weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
              code: '\uf059',
              size: 50,
              color: '#f0a30a'
            }
          },
          whatsb: {
            shape: 'icon',
            icon: {
              face: face,
              weight: "bold", // Font Awesome 5 doesn't work properly unless bold.
              code: '\uf0eb',
              size: 50,
              color: '#f0a30a'
            }
          }
        },
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
            //maxVelocity: 500, //50
            //minVelocity: 1, //0.1
            solver: 'repulsion',
            /*stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false//,
            //  fit: true
          },*/
          //timestep: 0.5,
          //adaptiveTimestep: true
        },
        manipulation: {
          // https://github.com/almende/vis/blob/master/examples/network/other/manipulationEditEdgeNoDrag.html
          addNode: function (data, callback) {
            app.shadowRoot.getElementById('node-operation').innerHTML = "Add Node";
            app.shadowRoot.getElementById('node-label').value = "";
            app.editNode(data, app.clearNodePopUp, callback);
          },
          editNode: function (data, callback) {
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
            app.shadowRoot.getElementById('edge-operation').innerHTML = "Add Edge";
            app.shadowRoot.getElementById('edge-label').value = "";
            app.editEdgeWithoutDrag(data, callback);
          },
          editEdge: function (data, callback) {
            app.shadowRoot.getElementById('edge-operation').innerHTML = "Edit Edge";
            app.editEdgeWithoutDrag(data, callback);
          },
        }
      }

      this.network = new vis.Network(container, this.data, options);

      this.network.on("selectNode", function (params) {
        console.log(params)
        app.selected_nodes =  app.network.body.data.nodes.get(params.nodes)
        app.selected_edges =  app.network.body.data.edges.get(params.edges)
      })

      this.network.on("selectEdge", function (params) {
        console.log(params)
        app.selected_nodes =  app.network.body.data.nodes.get(params.nodes)
        app.selected_edges =  app.network.body.data.edges.get(params.edges)
      })
      this.network.on("deselectNode", function (params) {
        console.log(params)
        app.selected_nodes =  app.network.body.data.nodes.get(params.nodes)
        app.selected_edges =  app.network.body.data.edges.get(params.edges)
      })
      this.network.on("deselectEdge", function (params) {
        console.log(params)
        app.selected_nodes =  app.network.body.data.nodes.get(params.nodes)
        app.selected_edges =  app.network.body.data.edges.get(params.edges)
      })
    }
    ///////////////////////////

    editNode(data, cancelAction, callback){
      console.log(data)
      this.shadowRoot.getElementById('node-label').value = data.label;
      this.shadowRoot.getElementById('node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
      this.shadowRoot.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
      this.shadowRoot.getElementById('node-popUp').style.display = 'block';
      //  this.agent.send("VisTool", {action: "changeTool", params: {data: data, tool: "editNode", callback: cb}})
    }

    // Callback passed as parameter is ignored
    clearNodePopUp() {
      this.shadowRoot.getElementById('node-saveButton').onclick = null;
      this.shadowRoot.getElementById('node-cancelButton').onclick = null;
      this.shadowRoot.getElementById('node-popUp').style.display = 'none';
    }

    cancelNodeEdit(callback) {
      this.clearNodePopUp();
      callback(null);
    }

    saveNodeData(data, callback) {
      data.label = this.shadowRoot.getElementById('node-label').value;
      this.clearNodePopUp();
      callback(data);
    }

    editEdgeWithoutDrag(data, callback){
      console.log(data)
      this.shadowRoot.getElementById('edge-label').value = data.label;
      this.shadowRoot.getElementById('edge-saveButton').onclick = this.saveEdgeData.bind(this, data, callback);
      this.shadowRoot.getElementById('edge-cancelButton').onclick = this.cancelEdgeEdit.bind(this,callback);
      this.shadowRoot.getElementById('edge-popUp').style.display = 'block';
    }

    clearEdgePopUp() {
      this.shadowRoot.getElementById('edge-saveButton').onclick = null;
      this.shadowRoot.getElementById('edge-cancelButton').onclick = null;
      this.shadowRoot.getElementById('edge-popUp').style.display = 'none';
    }

    cancelEdgeEdit(callback) {
      this.clearEdgePopUp();
      callback(null);
    }

    saveEdgeData(data, callback) {
      console.log(data)
      if (typeof data.to === 'object')
      data.to = data.to.id
      if (typeof data.from === 'object')
      data.from = data.from.id
      data.label = this.shadowRoot.getElementById('edge-label').value;
      this.clearEdgePopUp();
      callback(data);
    }

    configChanged(config){
      this.config = config
      console.log(this.config)
    }

  }

  customElements.define('vis-view', VisView);
