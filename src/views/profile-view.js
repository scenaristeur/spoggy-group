import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { fetchDocument } from "tripledoc";
import { space, vcard} from 'rdf-namespaces'; //https://gitlab.com/vincenttunru/rdf-namespaces/-/blob/master/src/generate.ts

class ProfileView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      profile: {type: Object},
      roles: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Profile"
    this.debug = true
    this.config = {}
    this.profile = {}
    this.roles = [{orga: "orga1", roles: ["dev", "cyclist"]},
    {orga: "orga2", roles: ["swing", "pop"]},
    {orga: "orga3", roles: ["flik", "flok"]}
  ]
}

render(){
  return html`
  <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
  <link href="css/fontawesome/css/all.css" rel="stylesheet">

  <div class="container-fluid">
  <b>${this.profile.name}</b>
  <br>
  <small>${this.profile.webId}</small>
  <br>
  ${this.profile.storage}<br>

  <ul>
  ${this.roles.map(r => html`
    <li>${r.orga}<br>
    ${r.roles.map(role => html`
      -> ${role}<br>
      `
    )}
    </li>
    `
  )}
  </ul>

  </div>


  <div ?hidden = "${!this.debug}">
  <hr>
  Hello from<b>${this.name}</b><br>
  debug : ${this.debug}<br>
  profile :
  <pre> ${JSON.stringify(this.profile, undefined, 2)}</pre><br>
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
        case "webIdChanged":
        app.webIdChanged(message.webId)
        break;
        default:
        console.log("Unknown action ",message)
      }
    }
  };
  //  this.init()
}

async initTripledoc_storage_doesnotwork(){
  const profileDoc = await fetchDocument(this.profile.webId);
  const p = profileDoc.getSubject(this.profile.webId);
  this.profile.name = p.getString(vcard.fn);
  this.profile.photo = p.getString(vcard.photo);
  this.profile.storage = p.getString(space.storage);
  //  let storage = await solid.data[this.profile.webId].storage
  //this.profile.storage = `${storage}`
  console.log("PROFILE",this.profile)
  //this.requestUpdate()
}

async init(){
  // use tripledoc for one request
  let name = await solid.data[this.profile.webId].vcard$fn || this.profile.webId.split("/")[2].split('.')[0];
  let photo = await solid.data[this.profile.webId].vcard$hasPhoto || "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
  let storage = await solid.data[this.profile.webId].storage

  this.profile.name = `${name}`
  this.profile.photo = `${photo}`
  this.profile.storage = `${storage}`

  console.log("PROFILE",this.profile)
  this.requestUpdate()
}


webIdChanged(webId){
  console.log(webId)
  if (webId == null){
    this.profile = {}
  }else{
    this.profile.webId = webId
    this.init()
  }
}

}

customElements.define('profile-view', ProfileView);
