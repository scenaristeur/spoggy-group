import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"

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
    <button type="button" class="btn btn-outline-secondary" disabled>${this.path}</button>
    </div>


    <ul class="list-group">
    ${this.folder.folders.map((f, i) =>
      html`
      <li class="list-group-item" url="${f.url}" type="${f.type}" @click="${this.changePath}">${f.name}</li>
      `
    )}
    </ul>
    <hr>
    <ul class="list-group">
    ${this.folder.files.map((f, i) =>
      html`
      <li class="list-group-item" url="${f.url}" type="${f.type}" @click="${this.changePath}">${f.name}</li>
      `
    )}
    </ul>
    </div>
    `;
  }

  changePath(e){
    console.log(e)
    let url = e.target.getAttribute("url")
    let type = e.target.getAttribute("type")

    if (type == "folder"){
      this.last = this.path
      this.path = url
      this.updateFolders()
    }else{
      console.log("A file, todo",url)
    }

  }


  async webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      console.log(this.webId)
      let storage = await solid.data[webId].storage
      this.storage = `${storage}`
      console.log(this.storage)
      this.path = this.storage
      this.updateFolders()
    }else{
      this.storage = ""
      this.path = ""
      this.folder = {folders:[], files: []}
    }
  }

  async updateFolders(){
    console.log(this.path)
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
