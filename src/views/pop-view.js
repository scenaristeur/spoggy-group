import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class PopView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      hide: {type: Boolean},
      parent: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Pop"
    this.hide = false
    this.parent = "e"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    #popUp {
      /*  display:none; */
    }
    </style>


    <div  id="popUp" class="modal ${this.hide ? "d-none" : "d-block" }" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">
    <h5 class="modal-title" id="edge-operation">Modal title</h5>
    <button type="button" id="edge-close" class="close" data-dismiss="modal" @click="${this.close}" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>
    <div class="modal-body">
    <!--  <tr>
    <td>id</td><td><input id="node-id" value="new value" /></td>
    </tr>-->
    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="edgeL">Label</span>
    </div>
    <input type="text" id="edge-label" class="form-control" placeholder="Edge label" aria-label="Edge label" aria-describedby="edgeL">
    </div>

    </div>
    <div class="modal-footer">
    <button type="button" id="edge-saveButton" class="btn btn-primary">Save changes</button>
    <button type="button" id="edge-cancelButton"  class="btn btn-secondary" @click="${this.close}" data-dismiss="modal">Close</button>


    </div>
    </div>
    </div>
    </div>
    <!-- fin modal -->

    `;
  }

  close(){
    this.hide = true
    this.agent.send(this.parent,{action: "popupClose"})
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

customElements.define('pop-view', PopView);
