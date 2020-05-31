import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { createDocument } from "tripledoc";
import { rdf, cal, wf, dc, meeting, vcard} from 'rdf-namespaces';


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
    this.shape = {fields : []}
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
        this.shadowRoot.getElementById(f.id).value = ""
      });
      console.log(object)
      console.log(this.shape.storage)
      console.log(this.shape.path)
      /* exemple de group
      @prefix : <#>.
      @prefix n: <http://www.w3.org/2006/vcard/ns#>.
      @prefix c: <https://angelo.veltens.org/profile/card#>.
      @prefix c0: </profile/card#>.
      @prefix ldp: <http://www.w3.org/ns/ldp#>.
      @prefix n0: <inbox/567d00a0-54d2-4977-a0aa-6b8999941bc5/>.

      :we a n:Group; n:fn "Demo group"; n:hasMembers c:me, c0:me; ldp:inbox n0:.
      */
      let now = new Date()
      let date =  now.toISOString()
      let obj_uri =""
      let objDoc = {}
      let main_subject = {}

      switch (this.shape.object_type) {
        case "Tension":
        obj_uri = this.shape.path+encodeURI(object.fields.name)+"_"+now.getTime()+"/index.ttl"
        objDoc = createDocument(obj_uri);
        main_subject = objDoc.addSubject({identifier: "this"})
        main_subject.setRef(rdf.type, this.shape.path);

        main_subject.setString("http://www.w3.org/ns/hola#whatIs", object.fields.wi)
        main_subject.setString("http://www.w3.org/ns/hola#whatShouldBe", object.fields.wsb)
        main_subject.setString("http://www.w3.org/ns/hola#proposition", object.fields.proposition)

        break;

        case "Organization":
        case "Circle":
        case "Role":
        obj_uri = this.shape.path+encodeURI(object.fields.name)+"/index.ttl"
        objDoc = createDocument(obj_uri);
        main_subject = objDoc.addSubject({identifier: "this"})

        main_subject.setRef(rdf.type, vcard.Group);
        main_subject.setString("http://www.w3.org/ns/org#purpose", object.fields.purpose)
        main_subject.setRef("http://www.w3.org/ns/org#subOrganizationOf", object.fields.parent)
        main_subject.setRef(vcard.hasMember, this.shape.webId)
        main_subject.setRef(vcard.hasMember, "https://spoggy-test.solid.community/profile/card#me")
        main_subject.setRef(vcard.hasMember, "https://spoggy-test2.solid.community/profile/card#me")
        break;
        default:
        console.log("I don't know what to do with this shape")
      }

      main_subject.setRef(rdf.type, this.shape.path);
      main_subject.setString("http://purl.org/dc/elements/1.1/created", date);
      main_subject.setRef("http://purl.org/dc/elements/1.1/author", this.shape.webId)

      let success = await objDoc.save();
      console.log(success)
      console.log("parent",this.parent)
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
