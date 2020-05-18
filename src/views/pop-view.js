import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { createDocument } from "tripledoc";
import { rdf, cal, wf, dc, meeting} from 'rdf-namespaces';


class PopView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      hide: {type: Boolean},
      parent: {type: String},
      shape: {type: Object},

    };
  }

  constructor() {
    super();
    this.name = "Pop"
    this.webId = null
    this.hide = false
    this.parent = "e"
    this.shape = {}
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


    <div id="popUp" class="modal ${this.hide ? "d-none" : "d-block" }" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
    <div class="modal-header">
    <h5 class="modal-title" id="edge-operation">${this.shape.name}</h5>
    <button type="button" id="edge-close" class="close" data-dismiss="modal" @click="${this.close}" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>
    <div class="modal-body">
    <p>
    ${this.shape.fields.map(f => html`
      ${this.htmlElmement(f)}
      `)}

      </p>

      </div>
      <div class="modal-footer">
      <button type="button" @click="${this.save}" class="btn btn-primary">Save changes</button>
      <button type="button" @click="${this.close}"  class="btn btn-secondary"  data-dismiss="modal">Close</button>


      </div>
      </div>
      </div>
      </div>
      <!-- fin modal -->

      `;
    }

    htmlElmement(field){
      let element = document.createElement(field.type)


      switch (field.type) {
        case "input":
        element = html `
        <div class="input-group mb-3">
        <div class="input-group-prepend">
        <span class="input-group-text" id="${field.label}">${field.label}</span>
        </div>
        <input type="text" id="${field.id}"
        class="form-control"
        placeholder="${field.label}"
        aria-label="${field.label}"
        aria-describedby="${field.label}"
        ?disabled="${field.disabled}"
        value="${field.value || ""}">
        </div>`
        break;

        case "textarea":
        element = html`
        <div class="input-group">
        <div class="input-group-prepend">
        <span class="input-group-text">${field.label}</span>
        </div>
        <textarea id="${field.id}"
        class="form-control"
        aria-label="With textarea"
        ?disabled="${field.disabled}"
        value="${field.value || ""}">
        </textarea>
        </div>`
        break;

        default:

      }

      return html `${element}`
    }

    async save(){
      let object = {object_type: this.shape.object_type, fields : []}
      this.shape.fields.forEach((f, i) => {
        console.log(f)
        object.fields[f.id] = this.shadowRoot.getElementById(f.id).value.trim()
      });
      console.log(object)
      console.log(this.shape.storage)
      console.log(this.shape.path)
      let date =  new Date().toISOString()
      let obj_uri = this.shape.path+encodeURI(object.fields.name)+"/index.ttl"
      const objDoc = createDocument(obj_uri);
      let main_subject = objDoc.addSubject({identifier: "this"})

      main_subject.setRef(rdf.type, this.shape.path);
      main_subject.setString("http://purl.org/dc/elements/1.1/created", date);
      main_subject.setRef("http://purl.org/dc/elements/1.1/author", this.shape.webId)
      let success = await objDoc.save();
      console.log(success)
      this.agent.send(this.parent,{action: "refresh"})
      this.close()
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
