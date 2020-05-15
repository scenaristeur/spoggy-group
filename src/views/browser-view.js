import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"
import { fetchDocument } from "tripledoc";

class BrowserView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      storage: {type: String},
      path: {type: String},
      last: {type: String},
      folder: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Browser"
    this.webId = {}
    this.storage = ""
    this.path = ""
    this.last = ""
    this.folder = {folders:[], files: []}
    this.fc = new SolidFileClient(solid.auth)
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid" ?hidden="${this.path.length == 0}">
    <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-secondary" @click="${this.up}"><i class="fas fa-arrow-up" @click="${this.up}"></i> </button>
    <button type="button" class="btn btn-secondary" @click="${this.prec}"><i class="fas fa-arrow-left" @click="${this.prec}"></i></button>
    <button type="button" class="btn btn-secondary" disabled @click="${this.new_folder}"><i class="fas fa-folder-plus" @click="${this.new_folder}"></i></button>
    <button type="button" class="btn btn-secondary" disabled @click="${this.new_file}"><i class="fas fa-file" @click="${this.new_file}"></i></button>
    <button type="button" class="btn btn-secondary" disabled @click="${this.file_import}"><i class="fas fa-file-import" @click="${this.file_import}"></i></button>
    <button type="button" class="btn btn-secondary" disabled @click="${this.solid}"><i class="fas fa-user-friends" @click="${this.solid}"></i> solid friends...</button>
    </div>
    <br>
    <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-outline-secondary" disabled>${this.path}</button>
    </div>


    <ul class="list-group">
    ${this.folder.folders.map((f, i) =>
      html`
      <li class="list-group-item" url="${f.url}" type="${f.type}" @click="${this.changePath}">
      <i class="fas fa-folder"></i>
      ${f.name}</li>
      `
    )}
    </ul>
    <hr>
    <ul class="list-group">
    ${this.folder.files.map((f, i) =>
      html`
      <li class="list-group-item">
      <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group" role="group" aria-label="First group">
      <button type="button" class="btn btn-outline-secondary" url="${f.url}" type="${f.type}" @click="${this.changePath}">
      <i class="fas fa-file"></i>
      ${f.name}
      </button>
      </div>

      <div class="btn-group" role="group">
      <button type="button" class="btn btn-secondary" disabled><i class="fas fa-file-download"></i></button>
      <button type="button" class="btn btn-secondary"disabled><i class="fas fa-file-export"></i></button>
      </div>
      </div>
      </li>
      `
    )}
    </ul>
    </div>
    `;
  }

  changePath(e){
    //    console.log(e)
    let url = e.target.getAttribute("url")
    let type = e.target.getAttribute("type")
    if (type == "folder"){
      this.last = this.path
      this.path = url
      this.updateFolders()
    }else{
      console.log("A file, todo",url)
      this.getFile(url)
    }
  }

  async getFile(url){

    if(url.endsWith(".ttl") || url.endsWith("/card")){
      const doc = await fetchDocument(url);
      console.log("doc",doc)
      let triples = doc.getTriples()
      console.log("triples",triples)
      //  let vis_network = this.statements2vis(triples)
      this.agent.send("Vis", {action: "triplesChanged", triples: triples})
    }
    else{
      alert("this file extension is not treated yet, come back soon ;-)")
    }
  }


  statements2vis(statements){
    console.log("statements2vis")
    var app = this;
    var data = {nodes:[], edges:[]};
    //  var i = 0;
    statements.forEach(function (statement){
      //console.log(statement)
      //  i++;
      //  app.agentImport.send('agentApp', {type: 'message', data: statements.length-i});
      //  console.log("STATEMENT2VIS", statement)
      var edges = [];
      var s = statement.subject;
      var p = statement.predicate;
      var o = statement.object;
      var w = statement.why;

      switch(p.value) {
        case "http://www.w3.org/2000/01/rdf-schema#label":
        case "http://xmlns.com/foaf/0.1/label":
        var nodeAndLabel = {
          id: s.value,
          title: o.value,
          label: o.value,
          why: w.value,
          y:2*Math.random(),
          type: "node"
        };
        console.log("push",s.value,"label",o.value)
        //app.addNodeIfNotExist(app.network, nodeAndLabel)
        data.nodes.push(nodeAndLabel)
        break;
        default:
        //console.log("NON LABEL ",p.value);
        console.log("###\n",s.value,"\n",p.value,"\n",o.value)
        var edges = [];
        var nodeSujetTemp = app.detailNoeud(s,w);
        var nodeObjetTemp = app.detailNoeud(o,w);
        data.nodes.push(nodeSujetTemp)
        data.nodes.push(nodeObjetTemp)


        data.edges.push({from:s.value, to: o.value, arrows: 'to', label: app.localname(p), uri: p.value});
        //  app.addEdgeIfNotExist(app.network,{from:s.subject.value, to: s.object.value, arrows: 'to', label:s.predicate.value});

        //app.network.body.data.edges.update(edges)
      }
    });
    console.log(data)

    return data;
  }


  detailNoeud(n,w){
    var node = {}
    console.log(n)
    switch (n.termType) {

      case 'BlankNode':
      var l = this.localname(n);
      node = {
        id: n.value,
        why: w.value,
        //  y:2*Math.random(),
        type: "node"
      };
      if (n.value != l){
        node.title= l;
        node.label = l;
      }
      break;
      case 'Collection':
      n.elements.forEach(function(elem){
        console.log("elem",elem)
        this.detailNoeud(elem,w)
      })
      break;
      case 'Literal':
      var l = this.localname(n).length>37? this.localname(n).substring(0,40)+"..." : this.localname(n);
      node = {
        id: n.value,
        title: n.value,
        label: l,
        why: w.value,
        //  y:2*Math.random(),
        type: "node",
        shape: "box",
        color: "rgb(240,220,110)"
      };
      break;
      case 'NamedNode':
      var l = this.localname(n);
      node = {
        id: n.value,
        title: n.value,
        label: l,
        why: w.value,
        //  y:2*Math.random(),
        type: "node"
      };
      if(l == "me"){
        node.label =  node.title;
        node.shape = "image";
        node.image = "./assets/profile.svg";
        node.type = "webId";
      }
      break;
      default:
      console.log('Sorry, je ne traite pas encore ' + n.termType + '.');
      node = {
        id: n.value,
        title: n.value,
        label: n.value,
        why: w.value,
        //  y:2*Math.random(),
        type: "node"
      };

    }
    console.log(node)
    //
    return node;
  }


  localname(node){
    //  console.log("LOCALNAME OF ",node)
    if (node.value != undefined){
      var value = node.value;
      //  console.log(value)
      if (value.endsWith('/') || value.endsWith('#')){
        value = value.substring(0,value.length-1);
      }
      var labelU = value;
      if (node.termType == "NamedNode"){
        //  console.log("namenode")
        var uLabel = value.split("#");
        var labelU = uLabel[uLabel.length-1];
        if (labelU == uLabel){
          uLabel = value.split("/");
          labelU = uLabel[uLabel.length-1];
        }
      }else{
        console.log("TODO : literal or blanknode ???", node)
      }
      //  console.log(labelU)
      return labelU;
    }else{
      console.log("TODO node.value = undefined, il faut maintenant traiter le tableau",node.elements)
    }

  }



  async webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      console.log(this.webId)
      let storage = await solid.data[webId].storage
      this.storage = `${storage}`
      //    console.log(this.storage)
      this.path = this.storage
      this.updateFolders()
    }else{
      this.storage = ""
      this.path = ""
      this.folder = {folders:[], files: []}
    }
  }

  async updateFolders(){
    //  console.log(this.path)
    this.folder = await this.fc.readFolder(this.path)
    console.log("folder",this.folder)
  }


  up(){
    this.path = this.folder.parent
    this.updateFolders()
  }

  prec(){
    // TODO manage an history
    this.path = this.last
    this.updateFolders()
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
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

}

customElements.define('browser-view', BrowserView);
