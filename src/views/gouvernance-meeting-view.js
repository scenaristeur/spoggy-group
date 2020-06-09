import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"
import { createDocument } from "tripledoc";
import { rdf, cal, wf, dc, meeting} from 'rdf-namespaces';

class GouvernanceMeetingView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      meetings: {type: Array},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Gouv meeting"
    this.webId = ""
    this.fc = new SolidFileClient(solid.auth)
    this.meetings = []
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">

    <div class="row">
    <h2>New Meeting</h2>
    <div class="input-group">
    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">Summary</span>
    </div>
    <input type="text" id="summary" class="form-control" placeholder="Name" aria-label="Name" aria-describedby="basic-addon1">
    </div>

    <div class="input-group">
    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon2">Location</span>
    </div>
    <input type="text" id="location" class="form-control" placeholder="Location" aria-label="Location" aria-describedby="basic-addon2">
    </div>

    <div class="input-group">
    <div class="input-group-prepend">
    <span class="input-group-text" id="">Start/End</span>
    </div>
    <input type="date" id="start" class="form-control">
    <input type="date" id="end" class="form-control">
    </div>

    <div class="input-group  mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text">Comment</span>
    </div>
    <textarea class="form-control" id="comment" aria-label="With textarea"></textarea>
    </div>

    <button class="btn btn-primary" @click="${this.submit}">Submit</button>

    </div>

    <div class="row">
    ${this.meetings.map((m, i) => html`
      <meeting-view name="${"Meeting_"+i}" folder="${m.url}">Loading ${m.url}<meeting-view>
      `
    )}
    </div>

    </div>

    `;
  }

  async submit(){
    let meet = {}
    meet.created = new Date().toISOString()
    meet.summary = this.shadowRoot.getElementById("summary").value.trim()
    meet.location = this.shadowRoot.getElementById("location").value.trim()
    meet.start = this.shadowRoot.getElementById("start").value.trim()
    meet.end = this.shadowRoot.getElementById("end").value.trim()
    meet.comment = this.shadowRoot.getElementById("comment").value.trim()
    console.log(meet)
    let meet_uri = this.path+encodeURI(meet.summary)+"/index.ttl"
    console.log(meet_uri)
    const meetDoc = createDocument(meet_uri);
    let main_subject = meetDoc.addSubject({identifier: "this"})
    let participation_subject = meetDoc.addSubject()
    console.log("subj",main_subject)
    main_subject.setRef(rdf.type, meeting.Meeting);

    main_subject.setString(cal.summary, meet.summary);
    main_subject.setString(cal.location, meet.location);
    main_subject.setString(cal.dtstart, meet.start);
    main_subject.setString(cal.dtend, meet.end);
    main_subject.setString(cal.comment, meet.comment);
    main_subject.setString("http://purl.org/dc/elements/1.1/created", meet.created);
    main_subject.setRef("http://purl.org/dc/elements/1.1/author", this.webId)
    main_subject.setString('http://www.w3.org/ns/ui#backgroundColor', "#ddddcc")
    //main_subject.setRef('http://www.w3.org/ns/pim/meeting#toolList', main_subject.asRef())
    main_subject.setRef("http://www.w3.org/2005/01/wf/flow#participation", participation_subject.asRef())

    participation_subject.setString(cal.dtstart,meet.created)
    participation_subject.setRef("http://www.w3.org/2005/01/wf/flow#participant", this.webId)
    participation_subject.setString('http://www.w3.org/ns/ui#backgroundColor', "#dbe0cb")

    const toolList = meetDoc.addSubject();
    toolList.setRef(rdf.first, main_subject.asRef());
    toolList.setRef(rdf.type, rdf.List);
    toolList.setRef(rdf.rest, "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil");
    main_subject.setRef(meeting.toolList, toolList.asRef());
    /*
    acl: 'http://www.w3.org/ns/auth/acl#',
    arg: 'http://www.w3.org/ns/pim/arg#',
    cal: 'http://www.w3.org/2002/12/cal/ical#',
    contact: 'http://www.w3.org/2000/10/swap/pim/contact#',
    dc: 'http://purl.org/dc/elements/1.1/',
    dct: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    http: 'http://www.w3.org/2007/ont/http#',
    hydra: 'http://www.w3.org/ns/hydra/core#',
    ldp: 'http://www.w3.org/ns/ldp#',
    link: 'http://www.w3.org/2007/ont/link#',
    log: 'http://www.w3.org/2000/10/swap/log#',
    meeting: 'http://www.w3.org/ns/pim/meeting#',
    owl: 'http://www.w3.org/2002/07/owl#',
    qu: 'http://www.w3.org/2000/10/swap/pim/qif#',
    trip: 'http://www.w3.org/ns/pim/trip#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    sched: 'http://www.w3.org/ns/pim/schedule#',
    schema: 'http://schema.org/',
    sioc: 'http://rdfs.org/sioc/ns#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    solid: 'http://www.w3.org/ns/solid/terms#',
    space: 'http://www.w3.org/ns/pim/space#',
    tab: 'http://www.w3.org/2007/ont/link#',
    tabont: 'http://www.w3.org/2007/ont/link#',
    vcard: 'http://www.w3.org/2006/vcard/ns#',
    wf: 'http://www.w3.org/2005/01/wf/flow#',
    */
    /*@prefix : <#>.
    @prefix mee: <http://www.w3.org/ns/pim/meeting#>.
    @prefix ic: <http://www.w3.org/2002/12/cal/ical#>.
    @prefix XML: <http://www.w3.org/2001/XMLSchema#>.
    @prefix flow: <http://www.w3.org/2005/01/wf/flow#>.
    @prefix c: </profile/card#>.
    @prefix ui: <http://www.w3.org/ns/ui#>.
    @prefix n0: <http://purl.org/dc/elements/1.1/>.

    :id1589757677361
    ic:dtstart "2020-05-17T23:21:17Z"^^XML:dateTime;
    flow:participant c:me;
    ui:backgroundColor "#dbe0cb".
    :this
    a mee:Meeting;
    n0:author c:me;
    n0:created "2020-05-17T23:21:01Z"^^XML:dateTime;
    ic:comment "comment cool";
    ic:dtend "2020-05-13"^^XML:date;
    ic:dtstart "2020-05-04"^^XML:date;
    ic:location "nowhere";
    ic:summary "second test meeting";
    flow:participation :id1589757677361;
    mee:toolList ( :this );
    ui:backgroundColor "#ddddcc"^^XML:color.
    */


    let success = await meetDoc.save();
    console.log(success)
    this.meetings = []
    this.listMeetings()
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
  }


  async webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      console.log(this.webId)
      let storage = await solid.data[webId].storage
      this.storage = `${storage}`
      //    console.log(this.storage)
      this.path = this.storage+"public/spoggy/Meeting/gouvernance/"
      await this.initPath()
      await this.listMeetings()
      console.log(this.path)
    }
  }


  async listMeetings(){
    this.meeting_folder = await this.fc.readFolder(this.path)
    this.meetings = this.meeting_folder.folders
    console.log("meetings",this.meetings)
  }


  async initPath(){
    if( !(await this.fc.itemExists(this.path)) ) {
      await this.fc.createFolder(this.path).then((content) => {
        alert("Successfully created "+this.path)
      })
      .catch((err) =>{
        alert("I cannot create "+ this.path);
        console.error(`Error: ${err}`)})
      }
    }

  }

  customElements.define('gouvernance-meeting-view', GouvernanceMeetingView);
