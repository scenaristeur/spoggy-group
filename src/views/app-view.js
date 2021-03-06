import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class AppView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      levels: {type: Array},
      level: {type: String},
      url: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    //https://labdsurlholacracy.com/bande-dessinee-holacracy#page-54-55
    this.levels = [ "Browser", "Triple",
    "Node", "World", "Organization",
    "Tension", "Gouv", "Cockpit", "Todo", "User", "Profile", "Sparql"] // "Pod",,"World", "Orga",  "Groups" ["World", "Organization", "Pod", "Folder", "File", "Triple", "Node" ]
    this.level = "World"
    this.url = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">

    <div class="container-fluid">



    <div class="row">
    <div class="col-md-6">
    <vis-view name="Vis">Loading VIS</vis-view>
    </div>
    <div class="col">
    <div class="row">
    ${this.levels.map(l =>
      html`
      <button class="btn btn-outline-primary ${this.level == l ? "active": ""}" level="${l}" @click="${this.levelChanged}">${l}</button>
      `)}
      <login-element name="Login"></login-element>
      </div>
      <browser-view name="Browser" ?hidden="${this.level != "Browser"}"></browser-view>
      <input-view name="Input" ?hidden="${this.level != "Triple"}"></input-view>
      <selected-view name="Selected" ?hidden="${this.level != "Node"}"></selected-view>


      <div class="row">
      <element-view name="ElementView" url="${this.url}"></element-view>
      </div>

      <todo-view name="Todo" ?hidden="${this.level != "Todo"}"></todo-view>
      <world-view name="World" ?hidden="${this.level != "World"}"></world-view>
      <organization-view name="Organization" url="${this.url}" ?hidden="${this.level != "Organization"}"></organization-view>
      <gouvernance-meeting-view name="Gouvernance" ?hidden="${this.level != "Gouv"}"></gouvernance-meeting-view>
      <cockpit-view name="Cockpit" ?hidden="${this.level != "Cockpit"}"></cockpit-view>
      <circle-view name="Circle" url="${this.url}" ?hidden="${this.level != "Circle"}"></circle-view>
      <role-view name="Role" url="${this.url}" ?hidden="${this.level != "Role"}"></role-view>
      <tension-view name="Tension" url="${this.url}" ?hidden="${this.level != "Tension"}"></tension-view>
      <user-view name="User" url="${this.url}" ?hidden="${this.level != "User"}"></user-view>

      <profile-view name="Profile" url="${this.url}" ?hidden="${this.level != "Profile"}"></profile-view>

      <sparql-view name="Sparql"  ?hidden="${this.level != "Sparql"}"></sparql-view>
      </div>
      </div>

      </div>
      `;
    }

    levelChanged(e){
      this.level = e.target.getAttribute("level")
    }
    /*function recupParams(){
    //console.log(window.location)
    var url = window.location.search+window.location.hash;  // pour catcher les /card#me
    var params = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {        var p=a[i].split('=', 2);
    if (p.length == 1)
    b[p[0]] = "";
    else
    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
})(url.substr(1).split('&'));
return params;
}*/



firstUpdated(){
  var app = this;
  this.agent = new HelloAgent(this.name);
  console.log(this.agent)
  this.agent.receive = function(from, message) {
    //  console.log("messah",message)
    if (message.hasOwnProperty("action")){
      //  console.log(message)
      switch(message.action) {
        case "levelChanged":
        app.level = message.level
        app.url = message.url
        console.log(app.level)
        break;
        default:
        console.log("Unknown action ",message)
      }
    }
  };
}

configChanged(config){
  this.config = config
  console.log(this.config)
}

}

customElements.define('app-view', AppView);
