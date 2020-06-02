import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class UserView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      userShape: {type: Object},
      url: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "User"
    this.debug = true
    this.config = {}
    this.url = ""
    this.userShape = {
      name: "New User",
      object_type: "User",
      fields : [
        {label: "Username", type: "input", id: "name", value: ""},
        {label: "Bio", type: "textarea", id: "bio", value: ""},
        {label: "Skills", type: "textarea", id: "skill", value: ""},
        {label: "Roles", type: "select",
        id: "roles",
        source:"https://holacracy.solid.community/public/spoggy/Role/",
        add: true, value: ""},
      ]}
    }

    render(){
      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">

      <div class="container-fluid">
      <liste-view name="Users" .shape="${this.userShape}"></liste-view>

      </div>


      <div ?hidden = "${!this.debug}">

      Hello from<b>${this.name}</b><br>
      debug : ${this.debug}<br>
      config :
      <pre> ${JSON.stringify(this.config, undefined, 2)}</pre><br>
      </div>


      `;
    }


    changeLevel(e){
      let url = e.target.getAttribute("url")
      let level = e.target.getAttribute("level")
      console.log(url)
      this.agent.send("App", {action: "levelChanged", level: level, url: url})
      //  this.agent.send(this.shape.object_type, {action: "urlChanged", url: url})
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
    }

    configChanged(config){
      this.config = config
      console.log(this.config)
    }

  }

  customElements.define('user-view', UserView);
