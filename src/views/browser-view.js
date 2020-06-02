import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"
import { fetchDocument } from "tripledoc";
import { namedNode } from '@rdfjs/data-model';

class BrowserView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      storage: {type: String},
      path: {type: String},
      last: {type: String},
      folder: {type: Object},
      folderName: {type: String},
      fileName: {type: String},
      createHidden: {type: Boolean},
      currentFile: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Browser"
    this.webId = null
    this.storage = ""
    this.path = ""
    this.last = ""
    this.folder = {folders:[], files: []}
    this.folderName = ""
    this.fileName = ""
    this.fc = new SolidFileClient(solid.auth)
    this.createHidden = true
    this.currentFile = null
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">


    currentFile : ${this.currentFile}
    <div class="container-fluid" ?hidden="${this.path.length == 0}">
    <div class="btn-group  container-fluid" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-secondary" @click="${this.up}"><i class="fas fa-arrow-up" @click="${this.up}"></i> </button>
    <button type="button" class="btn btn-secondary" @click="${this.prec}"><i class="fas fa-arrow-left" @click="${this.prec}"></i></button>
    <button type="button" class="btn btn-secondary" input_type="foldername" @click="${this.new}"><i class="fas fa-folder-plus" input_type="foldername"  @click="${this.new}"></i></button>
    <button type="button" class="btn btn-secondary" input_type="filename" @click="${this.new}"><i class="fas fa-file" input_type="filename" @click="${this.new}"></i></button>
    <button type="button" class="btn btn-secondary" input_type="file" @click="${this.new}"><i class="fas fa-file-upload" input_type="file" @click="${this.new}"></i></button>
    <button type="button" class="btn btn-secondary" disabled @click="${this.solid}"><i class="fas fa-user-friends" @click="${this.solid}"></i> solid</button>
    </div>
    <br>
    <div class="btn-group container-fluid" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-outline-secondary" disabled>${this.path}</button>
    </div>


    <div  ?hidden="${this.createHidden}"
    class="btn-group container-fluid" role="group" aria-label="new">
    <div class="input-group mb-3">
    <input type="text"
    id="create_input" class="form-control"
    placeholder="Folder or File name"
    aria-label="Folder or File name"
    aria-describedby="basic-addon2">
    <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button" @click="${this.create}">Create</button>
    <i class="fas fa-times btn btn-outline-secondary" @click="${this.closeCreateInput}"></i>
    </div>
    </div>
    </div>



    <div style="height:40vh; width:100%; overflow: auto">
    <ul class="list-group">
    ${this.folder.folders.map((f, i) =>
      html`
      <li class="list-group-item" url="${f.url}" type="${f.type}" @click="${this.changePath}">
      <i class="fas fa-folder"></i>
      ${decodeURI(f.name)}</li>
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
      <div class="text-outline-secondary" url="${f.url}" type="${f.type}" @click="${this.changePath}">
      <i class="fas fa-file" url="${f.url}" type="${f.type}" @click="${this.changePath}"></i>
      ${decodeURI(f.name)}
      </div>
      </div>

      <div class="btn-group" role="group">
      <a href="${f.url}" class="btn btn-secondary btn-sm" target="_blank"><i class="fas fa-external-link-alt"></i></a>
      <!--    <button type="button" class="btn btn-secondary btn-sm" disabled><i class="fas fa-file-download"></i></button>
      <button type="button" class="btn btn-secondary btn-sm"disabled><i class="fas fa-file-export"></i></button>
      -->  <button type="button" class="btn btn-secondary btn-sm" url='${f.url}' @click="${this.deleteFile}"><i class="fas fa-trash" url='${f.url}' @click="${this.delete}"></i></button>
      </div>
      </div>
      </li>
      `
    )}
    </ul>
    </div>
    </div>
    `;
  }


  new(e){
    this.createHidden = false
    let input_type = e.target.getAttribute("input_type")
    this.shadowRoot.getElementById("create_input").setAttribute("input_type", input_type)
    this.shadowRoot.getElementById("create_input").setAttribute("type", input_type == "file" ? "file" : "text")
    if (input_type == "filename"){
      this.shadowRoot.getElementById("create_input").value = (new Date).toISOString().replace(/:/gi,'-').replace(/t/gi,'_').replace(/z/gi,'').trim()+".ttl"
      this.agent.send("Vis", {action: "clear"})
    }

    //  this.shadowRoot.getElementById("create_input").placeholder( type)
  }

  async create(){
    let name =  this.shadowRoot.getElementById("create_input").value.trim()
    if(name.length > 0){
      let input_type =   this.shadowRoot.getElementById("create_input").getAttribute("input_type")
      console.log(name, input_type)
      let create_path = this.path+name

      switch (input_type) {
        case "filename":
        create_path = !create_path.endsWith(".ttl") ? create_path+".ttl" : create_path
        console.log(create_path)
        this.currentFile = create_path
        this.agent.send("Vis", {action: "currentFileChanged", currentFile: this.currentFile})
        let defaultContent = "# created by Spoggy App"
        await this.fc.createFile(create_path,defaultContent,"text/turtle").catch(err => console.error(`Error: ${err}`))

        break;
        case "foldername":
        console.log(create_path)
        await this.fc.createFolder(create_path).catch(err => console.error(`Error: ${err}`))
        break;
        case "filename":
        console.log("TODO : upload")
        break;
        default:

      }
      this.createHidden = true
      this.updateFolder()
      this.shadowRoot.getElementById("create_input").value = ""
    }else{
      alert ("I can't create a folder or a file with a blank name !")
    }

  }

  closeCreateInput(){
    this.createHidden = true
  }

  async deleteFile(e){
    let url = e.target.getAttribute("url")

    var del = confirm("Do you want really want to delete "+url+" ?");
    if (del == true){
      await this.fc.deleteFile(url)
      this.updateFolder()
    }

    /*
    TODO AFTER CONFIRM
    https://github.com/jeff-zucker/solid-file-client#deletefile-fileurl-options-
    deleteFile( fileURL, options )
    deleteFolder( folderURL )
    */
  }


  changePath(e){
    //    console.log(e)
    let url = e.target.getAttribute("url")
    let type = e.target.getAttribute("type")
    if (type == "folder"){
      this.last = this.path
      this.path = url
      this.updateFolder()
    }else{
      console.log("A file, todo",url)
      this.getFile(url)
    }
  }

  async getFile(url){
    this.createHidden = true
    try{
      const doc = await fetchDocument(url);
      this.currentFile = url
      this.agent.send("Vis", {action: "currentFileChanged", currentFile: this.currentFile})

      //  console.log("doc",doc)
      let triples = doc.getTriples()
      console.log("triples",triples)
      //  let vis_network = this.statements2vis(triples)
      this.agent.send("Vis", {action: "triplesChanged", triples: triples})

    }
    catch(e){
      console.log(e)
      alert("Oh i've got a problem to read this file :-(")
    }
    console.log("currentFile", this.currentFile)
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
      this.path = this.storage+"public/spoggy/"
      if( !(await this.fc.itemExists(this.path)) ) {
        await this.fc.createFolder(this.path) // only create if it doesn't already exist
      }
      let newfilename = (new Date).toISOString().replace(/:/gi,'-').replace(/t/gi,'_').replace(/z/gi,'').trim()+".ttl"
      this.shadowRoot.getElementById("create_input").value = newfilename
      this.shadowRoot.getElementById("create_input").setAttribute("input_type", "filename")
      this.createHidden = false
      this.currentFile = this.path+newfilename
      this.agent.send("Vis", {action: "clear"})
      this.agent.send("Vis", {action: "currentFileChanged", currentFile: this.currentFile})
      this.updateFolder()
    }else{
      this.storage = ""
      this.path = ""
      this.folder = {folders:[], files: []}
      this.currentFile = null
      this.agent.send("Vis", {action: "currentFileChanged", currentFile: this.currentFile})
    }
  }

  async updateFolder(){
    //  console.log(this.path)
    this.folder = await this.fc.readFolder(this.path)
    console.log("folder",this.folder)
  }

  async addTriple(t){
    let subject = t.subject
    let predicate = t.predicate
    let object = t.object
    if (this.currentFile == null){
      alert("Hey ! You must login to your POD to use me ! No need to give me 'Full Control', just the basic settings, a '/public/spoggy' folder will be created.")
    }else{
      console.log(this.currentFile)
      subject = this.currentFile+"#"+t.subject
      predicate = this.currentFile+"#"+t.predicate
      object = this.currentFile+"#"+t.object
      await solid.data[subject][predicate].add(namedNode(object))
      this.updateFolder()
      this.createHidden = true
    }
    this.agent.send("Vis", {action: "addTriple", triple: {subject: subject, predicate: predicate, object: object} })
  }

  up(){
    this.path = this.folder.parent
    this.updateFolder()
  }

  prec(){
    // TODO manage an history
    this.path = this.last
    this.updateFolder()
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
          case "addTriple":
          app.addTriple(message.triple)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

}

customElements.define('browser-view', BrowserView);
