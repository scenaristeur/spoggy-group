import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class CerclesView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      storage: {type: String},
      path: {type: String},
      cercles: {type: Array},
      circlePopHide: {type: Boolean},
      shape: {type: Object},
      fc: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Cercles"
    this.webId = null
    this.storage = ""
    this.path = ""
    this.circlePopHide = true
    this.cercles = [] // ["Marketting", "Formation", "Support", "Ventes", "Developpement", "Intégration", "Exploitation", "Achats" ]
    this.shape = {
      name: "New Circle",
      object_type: "Circle",
      fields : [
        {label: "Name", type: "input", id: "name"},
        {label: "Purpose", type: "textarea", id: "purpose", value: "v"},
        {label: "Super cercle", type: "input", id: "super", disabled: true, value: "Big circle, the Orga"},
      ]}
      this.fc = new SolidFileClient(solid.auth)
    }

    render(){
      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">

      <div class="container-fluid border border-info rounded mt-3">
      <h4>Cercles <i class=" btn btn-primary fas fa-plus-circle" @click="${this.circleOpen}"></i></h4>
      <div style="max-height:30vh; width:100%; overflow: auto">
      <ul class="list-group">
      ${this.cercles.sort().map((c) =>
        html`
        <li class="list-group-item">
        ${encodeURI(c.name)}
        </li>
        `
      )}
      </ul>
      </div>

      <!-- rapide pour transmettre le webId -->
      <pop-view name="CirclePop"
      parent ="${this.name}"
      .hide="${this.circlePopHide}"
      .shape="${this.shape}"
      >Load popUp</pop-view>
      `;
    }

    circleOpen(){
      this.circlePopHide = !this.circlePopHide
      console.log(this.circlePopHide)
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
            case "popupClose":
            app.circlePopHide = true
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

      this.shape.storage = "somewhere"
    }

    /*
    new(object){
    console.log("must store ",object)
  }*/
  async refresh(){

    //  console.log(this.path)
    this.folder = await this.fc.readFolder(this.shape.path)
    console.log("folder",this.folder)
    this.cercles = this.folder.folders

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

customElements.define('cercles-view', CerclesView);
