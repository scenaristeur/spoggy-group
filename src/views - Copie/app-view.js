import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class AppView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      levels: {type: Array},
      level: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.levels = ["World", "Organization", "Pod", "Folder", "File", "Triple", "Node" ]
    this.level = "World"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">

    <div class="container-fluid">
    <div class="row">
    ${this.levels.map(l =>
      html`
      <button class="btn btn-outline-primary" level="${l}" @click="${this.levelChanged}">${l}</button>
      `)}

      </div>

      <div class="row">
      <div class="col">
      <vis-view name="Vis">Loading VIS</vis-view>
      </div>
      <div class="col">
      ${this.level}
      </div>
      <!--    <vis-tool-view name="VisTool">Vis Tool</vis-tool-view> -->
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
        case "configChanged":
        app.configChanged(message.config)
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
