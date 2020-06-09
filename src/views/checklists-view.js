import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ChecklistsView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      checklists: {type: Array},
      checklistShape: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Checklists"
    this.debug = false
    this.checklists = ["one", "two", "tri", "hkuhk", "hkjhlhloih ezioi zeripoj ojpojizer pojopzer pojpezr poj^pezrt poj^pze piojprze poez^rjpo ", "bing a plop", "bnjouipoijefzf", "iuouhoiho"]
    this.checklistShape = {
      name: "New CheckList",
      object_type: "CheckList",
      fields: [
        {label: "Name", type: "input", id: "name"},
        {label: "Purpose", type: "textarea", id: "purpose", value: ""},
        {label: "Attributed to", type: "select",
        id: "attributedTo",
        source:"https://holacracy.solid.community/public/spoggy/Role/",
        add: true, value: this.url},

      ]
    }

  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid border border-info rounded mt-3">

    <liste-view name="Checklists" .shape="${this.checklistShape}" parent="${this.url}"></liste-view>


    <h4>Checklists   <i class="fas fa-plus-circle"></i></h4>
    <div style="max-height:30vh; width:100%; overflow: auto" >
    <ul class="list-group">
    ${this.checklists.map((c, i) =>
      html`
      <li class="input-group">
      <div class="input-group-prepend">
      <div class="input-group-text">
      <input type="checkbox" aria-label="Checkbox for following text input">
      </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with checkbox"
      value="${c}">

      </li>
      `
    )}
    </ul>

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

customElements.define('checklists-view', ChecklistsView);
