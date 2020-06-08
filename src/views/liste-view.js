import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ListeView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      storage: {type: String},
      path: {type: String},
      liste: {type: Array},
      popHide: {type: Boolean},
      shape: {type: Object},
      fc: {type: Object},
      parent: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "liste"
    this.webId = null
    this.storage = ""
    this.path = ""
    this.popHide = true
    this.liste = [] // ["Marketting", "Formation", "Support", "Ventes", "Developpement", "Intégration", "Exploitation", "Achats" ]
    this.shape = {fields: []}
    this.fc = new SolidFileClient(solid.auth)
    this.parent = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid border border-info rounded mt-3">
    <h4>
    <a href="${this.shape.path}" target="_blank"> ${this.liste.length} ${this.shape.object_type}</a>
     <i class=" btn btn-primary fas fa-plus-circle" @click="${this.open}"></i>
     </h4>

    <div style="max-height:30vh; width:100%; overflow: auto">
    <ul class="list-group">

    ${this.liste.sort().map((c) =>
      html`
      <li class="list-group-item"
      url="${c.url+"index.ttl#this"}" @click="${this.changeLevel}">
      ${decodeURI(c.name)}
      </li>
      `
    )}
    </ul>
    </div>

    <!-- rapide pour transmettre le webId -->
    <pop-view name="Pop"
    parent ="${this.name}"
    .hide="${this.popHide}"
    .shape="${this.shape}">
    Load popUp</pop-view>
    `;
  }

  changeLevel(e){
    let url = e.target.getAttribute("url")
    console.log(url)
    this.agent.send("App", {action: "levelChanged", level: this.shape.object_type, url: url})
    //  this.agent.send(this.shape.object_type, {action: "urlChanged", url: url})
  }

  open(){
      this.shape.parent = this.parent
    this.popHide = !this.popHide
    console.log(this.popHide)
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
  //  console.log(this.agent)
    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "popupClose":
          app.popHide = true
          break;
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          case "refresh":
          app.refresh()
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    this.init()
  }

  init(){
    this.shape.storage = "somewhere, must add webidChanged to element in login"
  }

  /*
  new(object){
  console.log("must store ",object)
}*/
async refresh(){

  //  console.log(this.path)
  this.folder = await this.fc.readFolder(this.shape.path)
  //  console.log("folder",this.folder)
  this.liste = this.folder.folders

}

async webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    console.log(this.webId)
    this.shape.webId = webId
    let storage = await solid.data[webId].storage
    this.shape.storage = `${storage}`
    //    console.log(this.storage)
    this.shape.path = this.shape.storage+"public/spoggy/"+this.shape.object_type+"/"

    this.refresh()
    if( !(await this.fc.itemExists(this.shape.path)) ) {
      await this.fc.createFolder(this.shape.path) // only create if it doesn't already exist
    }
  }else{
    this.shape.storage = ""
    this.shape.path = ""
    this.shape.webId = null

    //  this.agent.send("CirclePop", {action: "currentFileChanged", currentFile: this.currentFile})
  }

}

}

customElements.define('liste-view', ListeView);
