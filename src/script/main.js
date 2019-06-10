/***
 * file name : DTCaliperSensor2019.js
 * description : DTCaliperSensor Class
 * create date : 2019-05-08
 * creator : saltgamer
 ***/

import './caliperSensor-1.1.1';

class DTCaliperSensor {
    constructor(params) {


        console.log('[salt] Caliper: ', Caliper);

        this.BASE_IRI = params.baseIRI;
        this.COURSE_IRI = params.courseIRI;

        this.sensor = Caliper.Sensor;
        this.sensor.initialize(params.sensorURI);

        this.client = Caliper.Clients.HttpClient;

        this.userURI = params.userURI;
        this.syllabusURI = params.syllabusURI;
        this.syllabusName = params.syllabusName;
        this.edAppURI = params.edAppURI;
        this.edAppName = params.edAppName;

        this.courseName = params.courseName;
        this.courseNumber = params.courseNumber;
        this.courseDescription = params.courseDescription;
        this.academicSession = params.academicSession;

        this.homePageURI = params.homePageURI;
        this.homePageName = params.homePageName;
        this.membershipURI = params.membershipURI;
        this.membershipDescription = params.membershipDescription;

        this.assessmentURI = params.assessmentURI;
        this.assessmentName = params.assessmentName;
        this.maxAttempts = params.maxAttempts;
        this.maxSubmits = params.maxSubmits;
        this.maxScore = params.maxScore;

        this.quizPageURI = params.quizPageURI;
        this.quizPageName = params.quizPageName;

        this.sessionURI = params.sessionURI;
        this.sessionName = params.sessionName;

        this.attemptURI = params.attemptURI;

        this.resultURI = params.resultURI;
        this.totalScore = params.totalScore;
        this.scoreComment = params.scoreComment;

        const options = {
            // uri: 'http://localhost:63342/DTCaliperSensor2019/sample/response.json',
            // uri: window.location.origin + window.location.pathname.replace('index.html', 'response.json'),
            uri: params.sensorServerURL,
            withCredentials: false,
            headers: {
                'Authorization': params.Authorization,
                'Content-Type': 'application/json'
            },
            method: 'POST'
        };


        this.client.initialize(this.sensor.id.concat(params.clientURI), options);
        this.sensor.registerClient(this.client);

        this.caliperSensorData = {};
        this.currentEvent = {};
        this.currentEventType = null;
        this.currentAttempt = null;

        this.currentUser = this.getUser();
        this.courseHomePage = this.getCourseHomePage();
        this.course = this.getCourse();
        this.edApp = this.getEdApp();
        this.membership = this.getMembership();
        this.quiz = this.getQuiz();
        this.quizPage = this.getQuizPage();


        this.startSession();

    }


    getId() {
        return this.sensor.getId();
    }

    getUser() {
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.Person, {
            id: this.userURI,
            dateCreated: this.decrementDate(new Date(), 45)
        });
    }

    getSyllabus() {
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.Document, {
            id: this.syllabusURI,
            name: this.syllabusName,
            version: '1.0',
            dateCreated: this.decrementDate(new Date(), 14),
            dateModified: this.decrementDate(new Date(), 7)
        });
    }

    getEdApp() {
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.SoftwareApplication, {
            id: this.edAppURI,
            name: this.edAppName,
            dateCreated: this.decrementDate(new Date(), 30)
        });
    }

    getCourse() {
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.CourseSection, {
            id: this.COURSE_IRI,
            courseNumber: this.courseNumber,
            academicSession: this.academicSession,
            name: this.courseName,
            description: this.courseDescription,
            dateCreated: this.decrementDate(new Date(), 30),
            dateModified: this.decrementDate(new Date(), 28)
        });
    }

    getCourseHomePage() {
        const course = this.getCourse();
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.WebPage, {
            id: this.homePageURI,
            name: this.homePageName,
            isPartOf: course,
            dateCreated: this.decrementDate(new Date(), 28),
            dateModfied: this.decrementDate(new Date(), 25)
        });
    }

    getMembership() {
        const member = this.getUser();
        const organization = this.getCourse();

        return Caliper.Entities.EntityFactory().create(Caliper.Entities.Membership, {
            id: this.membershipURI,
            description: this.membershipDescription,
            member: member,
            organization: organization,
            roles: [Caliper.Entities.Role.learner.term],
            status: Caliper.Entities.Status.active.term,
            dateCreated: this.decrementDate(new Date(), 21)
        });
    }

    getQuiz() {
        const course = this.getCourse();
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.Assessment, {
            id: this.assessmentURI,
            name: this.assessmentName,
            isPartOf: course,
            dateCreated: this.decrementDate(new Date(), 28),
            dateModified: this.decrementDate(new Date(), 27),
            datePublished: this.decrementDate(new Date(), 14),
            dateToActivate: this.decrementDate(new Date(), 13),
            dateToShow: this.decrementDate(new Date(), 12),
            dateToStartOn: this.incrementDate(new Date(), 7),
            dateToSubmit: this.incrementDate(new Date(), 14),
            maxAttempts: this.maxAttempts,
            maxSubmits: this.maxSubmits,
            maxScore: this.maxScore
        });
    }

    getQuizPage() {
        const course = this.getCourse();
        return Caliper.Entities.EntityFactory().create(Caliper.Entities.WebPage, {
            id: this.quizPageURI,
            name: this.quizPageName,
            isPartOf: course,
            dateCreated: this.decrementDate(new Date(), 28),
            dateModified: this.decrementDate(new Date(), 25)
        });
    }

    createEnvelope(opts) {
        return this.sensor.createEnvelope(opts)
    }

    sendEnvelope(envelope) {
        this.sensor.sendToClients(envelope);
    }

    generateUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    decrementDate(date, decrement) {
        date.setDate(date.getDate() - decrement);
        return date.toISOString();
    }

    incrementDate(date, increment) {
        date.setDate(date.getDate() + increment);
        return date.toISOString();
    }

    startSession() {
        this.caliperSensorData.id = 'urn:uuid:' + this.generateUID();
        this.caliperSensorData.actor = this.currentUser;
        this.caliperSensorData.action = Caliper.Actions.loggedIn.term;
        this.caliperSensorData.obj = this.edApp;
        this.caliperSensorData.edApp = this.edApp;
        this.caliperSensorData.target = this.courseHomePage;
        this.caliperSensorData.group = this.course;
        this.caliperSensorData.membership = this.membership;

        const sessionStart = new Date().toISOString();
        const session = Caliper.Entities.EntityFactory().create(Caliper.Entities.Session, {
            id: this.sessionURI,
            name: this.sessionName,
            user:   this.actor,
            dateCreated: sessionStart,
            startedAtTime: sessionStart
        });

        this.currentEvent = Caliper.Events.EventFactory().create(Caliper.Events.SessionEvent, {
            id: this.caliperSensorData.id,
            actor: this.caliperSensorData.actor,
            action: this.caliperSensorData.action,
            object: this.caliperSensorData.obj,
            eventTime: new Date().toISOString(),
            target: this.caliperSensorData.target,
            edApp: this.caliperSensorData.edApp,
            group: this.caliperSensorData.group,
            membership: this.caliperSensorData.membership,
            session: session
        });

        this.currentEventType = 'Session Event (LOGGED IN)';

    }

    navigateToQuiz(callBack) {
        this.caliperSensorData.id = 'urn:uuid:' + this.generateUID();
        this.caliperSensorData.actor = this.currentUser;
        this.caliperSensorData.action = Caliper.Actions.navigatedTo.term;
        this.caliperSensorData.obj = this.quiz;
        this.caliperSensorData.target = this.quizPage;
        this.caliperSensorData.referrer = this.courseHomePage;

        if (this.currentEvent.target) {
            this.caliperSensorData.referrer = this.currentEvent.target;
        }

        this.caliperSensorData.edApp = this.edApp;
        this.caliperSensorData.group = this.course;
        this.caliperSensorData.membership = this.membership;

        const sessionStart = new Date().toISOString();
        const session = Caliper.Entities.EntityFactory().create(Caliper.Entities.Session, {
            id: this.sessionURI,
            name: this.sessionName,
            user:   this.caliperSensorData.actor,
            dateCreated: sessionStart,
            startedAtTime: sessionStart
        });

        this.currentEvent = Caliper.Events.EventFactory().create(Caliper.Events.NavigationEvent, {
            id: this.caliperSensorData.id,
            actor: this.caliperSensorData.actor,
            action: this.caliperSensorData.action,
            object: this.caliperSensorData.obj,
            eventTime: new Date().toISOString(),
            target: this.caliperSensorData.target,
            referrer: this.caliperSensorData.referrer,
            edApp: this.caliperSensorData.edApp,
            group: this.caliperSensorData.group,
            membership: this.caliperSensorData.membership,
            session: session
        });

        this.currentEventType = 'Navigation Event';

        const envelope = this.createEnvelope({
            sensor: this.getId(),
            data: this.currentEvent
        });

        this.sendEnvelope(envelope);

        if (callBack) callBack();
    }

    startQuiz(callBack) {
        this.caliperSensorData.id = 'urn:uuid:' + this.generateUID();
        this.caliperSensorData.actor = this.currentUser;
        this.caliperSensorData.action = Caliper.Actions.started.term;
        this.caliperSensorData.obj = this.quiz;
        this.caliperSensorData.attemptDate = new Date().toISOString();
        this.caliperSensorData.generated = Caliper.Entities.EntityFactory().create(Caliper.Entities.Attempt, {
            id: this.attemptURI,
            assignee: this.caliperSensorData.actor,
            assignable: this.caliperSensorData.obj,
            count: 1,
            dateCreated: this.caliperSensorData.attemptDate,
            startedAtTime: this.caliperSensorData.attemptDate
        });

        this.currentAttempt = this.caliperSensorData.generated;

        this.caliperSensorData.edApp = this.edApp;
        this.caliperSensorData.group = this.course;
        this.caliperSensorData.membership = this.membership;

        const sessionStart = new Date().toISOString();
        const session = Caliper.Entities.EntityFactory().create(Caliper.Entities.Session, {
            id: this.sessionURI,
            name: this.sessionName,
            user:   this.caliperSensorData.actor,
            dateCreated: sessionStart,
            startedAtTime: sessionStart
        });

        this.currentEvent = Caliper.Events.EventFactory().create(Caliper.Events.AssessmentEvent, {
            id: this.caliperSensorData.id,
            actor: this.caliperSensorData.actor,
            action: this.caliperSensorData.action,
            object: this.caliperSensorData.obj,
            eventTime: new Date().toISOString(),
            target: this.caliperSensorData.target,
            referrer: this.caliperSensorData.referrer,
            edApp: this.caliperSensorData.edApp,
            group: this.caliperSensorData.group,
            membership: this.caliperSensorData.membership,
            session: session
        });

        this.currentEventType = 'Assessment Event (STARTED)';

        const envelope = this.createEnvelope({
            sensor: this.getId(),
            data: this.currentEvent
        });

        this.sendEnvelope(envelope);

        if (callBack) callBack();
    }

    submitQuiz(callBack) {
        this.caliperSensorData.id = 'urn:uuid:' + this.generateUID();
        this.caliperSensorData.actor = this.currentUser;
        this.caliperSensorData.action = Caliper.Actions.submitted.term;
        this.caliperSensorData.obj = this.currentAttempt;

        console.log('[salt] submitQuiz - currentAttempt: ', this.currentAttempt);
        this.caliperSensorData.obj.endedAtTime = new Date().toISOString();
        this.currentAttempt = this.caliperSensorData.obj;

        this.caliperSensorData.edApp = this.edApp;
        this.caliperSensorData.group = this.course;
        this.caliperSensorData.membership = this.membership;

        const sessionStart = new Date().toISOString();
        const session = Caliper.Entities.EntityFactory().create(Caliper.Entities.Session, {
            id: this.sessionURI,
            name: this.sessionName,
            user: this.caliperSensorData.actor,
            dateCreated: sessionStart,
            startedAtTime: sessionStart
        });

        this.currentEvent = Caliper.Events.EventFactory().create(Caliper.Events.AssessmentEvent, {
            id: this.caliperSensorData.id,
            actor: this.caliperSensorData.actor,
            action: this.caliperSensorData.action,
            object: this.caliperSensorData.obj,
            eventTime: new Date().toISOString(),
            edApp: this.caliperSensorData.edApp,
            group: this.caliperSensorData.group,
            membership: this.caliperSensorData.membership,
            session: session
        });

        this.currentEventType = 'Assessment Event (SUBMITTED)';

        const envelope = this.createEnvelope({
            sensor: this.getId(),
            data: this.currentEvent
        });

        this.sendEnvelope(envelope);

        if (callBack) callBack();

    }

    gradeQuiz(score, callBack) {
        this.caliperSensorData.id = 'urn:uuid:' + this.generateUID();
        this.caliperSensorData.actor = this.edApp;
        this.caliperSensorData.action = Caliper.Actions.graded.term;
        this.caliperSensorData.obj = this.currentAttempt;
        this.caliperSensorData.generated = Caliper.Entities.EntityFactory().create(Caliper.Entities.Result, {
            id: this.caliperSensorData.obj.id + this.resultURI,
            attempt: this.caliperSensorData.obj,
            normalScore: score,
            penaltyScore: 0.0,
            extraCreditScore: 0.0,
            curvedTotalScore: 0.0,
            curveFactor: 0.0,
            totalScore: this.totalScore,
            comment: this.scoreComment,
            scoredBy:  this.caliperSensorData.actor,
            dateCreated: new Date().toISOString()
        });

        this.currentEvent = Caliper.Events.EventFactory().create(Caliper.Events.GradeEvent, {
            id: this.caliperSensorData.id,
            actor: this.caliperSensorData.actor,
            action: this.caliperSensorData.action,
            object: this.caliperSensorData.obj,
            eventTime: new Date().toISOString(),
            generated: this.caliperSensorData.generated

        });

        this.currentEventType = 'GradeEvent (GRADED)';

        const envelope = this.createEnvelope({
            sensor: this.getId(),
            data: this.currentEvent
        });

        this.sendEnvelope(envelope);

        if (callBack) callBack();
    }

}

window.DTCaliperSensor2019 = (params) => {
    return new DTCaliperSensor(params);
};




