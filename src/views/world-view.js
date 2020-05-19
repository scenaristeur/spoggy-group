import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class WorldView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    organizationShape: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "World"
    this.organizationShape = {
      name: "New Organization",
      object_type: "Organization",
      fields : [
        {label: "Name", type: "input", id: "name"},
        {label: "Purpose", type: "textarea", id: "purpose", value: ""},
        {label: "Creator", type: "input", id: "creator", disabled: true, value: "Todo"},
      ]}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <liste-view name="Organizations" .shape="${this.organizationShape}"></liste-view>

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

customElements.define('world-view', WorldView);
