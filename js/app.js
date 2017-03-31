let app = {
    key: "giftr-hass0302"
    , currentContact: -1
    , currentGift: -1
};
let data;
document.addEventListener('DOMContentLoaded', function () {
    //localStorage.removeItem(app.key);
    getProfiles();
    document.querySelector("#addPersonBtn").addEventListener("touchstart", function () {
        app.currentContact = -1;
        personModalScreen();
    });
});
window.addEventListener('push', function (ev) {
    let content = ev.currentTarget.document.querySelector(".table-view");
    let id = content.id;
    switch (id) {
    case "contact-list":
        document.querySelector("#addPersonBtn").addEventListener("touchstart", function () {
            app.currentContact = -1;
            console.log(app.currentContact);
            console.log("it goes to 1");
            personModalScreen();
        });
        DisplayList(0);
        break;
    case "gift-list":
        DisplayList(1);
        break;
    default:
        console.log("it goes to 3");
        //        window.location.reload("index.html");
        //        DisplayList(0);
    }
});

function getProfiles() {
    if (!localStorage.getItem(app.key)) {
        console.log("There are no existing profiles. Now creating localStorage file.");
        data = {
            "people": [
                {
                    "id": 827381263882763
                    , "name": "Jeff Bridges"
                    , "dob": "1960-05-23"
                    , "ideas": [
                        {
                            "idea": "White Russian"
                            , "at": "LCBO"
                            , "cost": ""
                            , "url": "http://lcbo.com/"
                        }
                        , {
                            "idea": "new Sweater"
                            , "at": "Value Village"
                            , "cost": "20.00"
                            , "url": ""
                        }
  ]
                }
                , {
                    "id": 19283719282833
                    , "name": "Walter Sobchak"
                    , "dob": "1961-12-12"
                    , "ideas": [
                        {
                            "idea": "new briefcase"
                            , "at": "Staples"
                            , "cost": "50.00"
                            , "url": ""
                        }
  ]
                }
]
        };
        localStorage.setItem(app.key, JSON.stringify(data));
    }
    else {
        console.log("There is localStorage file, will try to load all profies stored.");
        data = JSON.parse(localStorage.getItem(app.key));
        console.dir(data);
    }
    DisplayList(0);
}

function personModalScreen() {
    console.log(app.currentContact);
    let inputName = document.getElementById("inputName");
    let inputDate = document.getElementById("inputDate");
    let modal = document.getElementById("personModal");
    if (app.currentContact < 0) {
        modal.querySelector(".title").innerHTML = "Person Add";
        inputDate.value = "";
        inputName.value = "";
    }
    else {
        modal.querySelector(".title").innerHTML = "Person Edit";
        inputDate.value = data.people[app.currentContact].dob;
        inputName.value = data.people[app.currentContact].name;
    }
    let buttons = modal.getElementsByTagName("button");
    let saveBtn = buttons[1];
    let cancelBtn = buttons[0];
    cancelBtn.addEventListener("touchstart", cancelCheck);
    saveBtn.addEventListener("touchstart", saveCheck);
}

function giftModalScreen() {
    console.log("inside gift modal screen");
    let modal = document.getElementById("giftModal");
    let inputIdea = document.getElementById("inputIdea");
    let inputStore = document.getElementById("inputStore");
    let inputURL = document.getElementById("inputURL");
    let inputCost = document.getElementById("inputCost");
    modal.getElementsByTagName('p')[0].innerHTML = data.people[app.currentContact].name;
    if (app.currentGift < 0) {
        modal.querySelector(".title").innerHTML = "Gift Add";
        inputCost.value = "";
        inputIdea.value = "";
        inputURL.value = "";
        inputStore.value = "";
    }
    else {
        console.log(data.people[app.currentContact].ideas);
        modal.querySelector(".title").innerHTML = "Gift Edit";
        inputCost.value = data.people[app.currentContact].ideas[app.currentGift].cost;
        inputIdea.value = data.people[app.currentContact].ideas[app.currentGift].idea;
        inputURL.value = data.people[app.currentContact].ideas[app.currentGift].url;
        inputStore.value = data.people[app.currentContact].ideas[app.currentGift].at;
    }
    let buttons = modal.getElementsByTagName("button");
    let saveBtn = buttons[1];
    let cancelBtn = buttons[0];
    cancelBtn.addEventListener("touchstart", cancelCheck);
    saveBtn.addEventListener("touchstart", saveCheck);
}

function cancelCheck() {
    let modal;
    if (document.getElementById("giftModal")) {
        modal = document.getElementById("giftModal");
        let inputIdea = document.getElementById("inputIdea");
        let inputStore = document.getElementById("inputStore");
        let inputURL = document.getElementById("inputURL");
        let inputCost = document.getElementById("inputCost");
        inputCost.value = "";
        inputIdea.value = "";
        inputURL.value = "";
        inputStore.value = "";
        app.currentGift = -1;
    }
    if (document.getElementById("personModal")) {
        modal = document.getElementById("personModal");
        let inputName = document.getElementById("inputName");
        let inputDate = document.getElementById("inputDate");
        inputDate.value = "";
        inputName.value = "";
        app.currentContact = -1;
    }
    let cancelBtn = modal.getElementsByTagName("button")[0];
    console.log("cancel button");
    modal.classList.toggle("active");
    cancelBtn.removeEventListener("touchstart", cancelCheck);
}

function saveCheck() {
    let modal;
    // if its in the person page
    if (document.getElementById("personModal")) {
        modal = document.getElementById("personModal");
        let inputName = document.getElementById("inputName");
        let inputDate = document.getElementById("inputDate");
        if (app.currentContact >= 0) {
            data.people[app.currentContact].name = inputName.value;
            data.people[app.currentContact].dob = inputDate.value;
        }
        else {
            data.people.push({
                "name": inputName.value
                , "dob": inputDate.value
                , "id": Date.now()
                , "ideas": []
            });
        }
        let saveBtn = modal.getElementsByTagName("button")[1];
        saveBtn.removeEventListener("touchstart", saveCheck);
        inputDate.value = "";
        inputName.value = "";
        app.currentContact = -1;
        DisplayList(0);
    }
    // If its in the Gift page
    if (document.querySelector("#giftModal")) {
        modal = document.getElementById("giftModal");
        let saveBtn = modal.getElementsByTagName("button")[1];
        let inputIdea = document.getElementById("inputIdea");
        let inputStore = document.getElementById("inputStore");
        let inputURL = document.getElementById("inputURL");
        let inputCost = document.getElementById("inputCost");
        if (app.currentGift >= 0) {
            data.people[app.currentContact].ideas[app.currentGift].cost = inputCost.value;
            data.people[app.currentContact].ideas[app.currentGift].idea = inputIdea.value;
            data.people[app.currentContact].ideas[app.currentGift].url = inputURL.value;
            data.people[app.currentContact].ideas[app.currentGift].at = inputStore.value;
        }
        else {
            data.people[app.currentContact].ideas.push({
                "idea": inputIdea.value
                , "cost": inputCost.value
                , "at": inputStore.value
                , "url": inputURL.value
            });
        }
        app.currentGift = -1;
        DisplayList(1);
    }
    let saveBtn = modal.getElementsByTagName("button")[1];
    modal.classList.toggle("active");
    saveBtn.removeEventListener("touchstart", saveCheck);
    localStorage.removeItem(app.key);
    localStorage.setItem(app.key, JSON.stringify(data));
    data = JSON.parse(localStorage.getItem(app.key));
}

function DisplayList(witch) {
    if (witch == 0) {
        let ul = document.getElementById("contact-list");
        ul.innerHTML = "";
        data.people.forEach(function (element, index) {
            let li = document.createElement("li");
            let a = document.createElement('a');
            let a2 = document.createElement('a');
            let span = document.createElement('span');
            let span2 = document.createElement('span');
            let att = document.createAttribute('data-id');
            li.className += "table-view-cell";
            span.className += "name";
            a.href = "#personModal";
            a.setAttribute("data-id", index);
            a.innerHTML = element.name;
            a.addEventListener("touchstart", function () {
                app.currentContact = index;
                personModalScreen();
            });
            span.appendChild(a);
            a2.className += "navigate-right pull-right";
            a2.href = "gifts.html";
            a2.setAttribute("data-id", index);
            a2.addEventListener("touchstart", function () {
                app.currentContact = index;
            });
            span2.className += "dob";
            span2.innerHTML = element.dob;
            li.appendChild(span);
            a2.appendChild(span2);
            li.appendChild(a2);
            ul.appendChild(li);
        });
    }
    else {
        document.querySelector("#addGiftBtn").addEventListener("touchstart", function () {
            app.currentGift = -1;
            //console.log("it goes to 2");
            giftModalScreen();
        });
        let ul = document.getElementById("gift-list");
        ul.innerHTML = "";
        data.people[app.currentContact].ideas.forEach(function (element, index) {
            let li = document.createElement("li");
            let a = document.createElement('a');
            let span = document.createElement('span');
            let div = document.createElement('div');
            let where = document.createElement('p');
            let cost = document.createElement('p');
            li.className += "table-view-cell media";
            span.className = "pull-right icon icon-trash midline";
            span.addEventListener("touchstart", function () {
                data.people[app.currentContact].ideas.splice(index, 1);
                localStorage.removeItem(app.key);
                localStorage.setItem(app.key, JSON.stringify(data));
                DisplayList(1);
            })
            div.className += "media-body";
            div.innerHTML += element.idea;
            div.addEventListener("touchstart", function () {
                app.currentGift = index;
                document.getElementById("giftModal").classList.toggle("active");
                giftModalScreen();
            });
            where.appendChild(a);
            cost.innerHTML = element.cost;
            a.href = element.url;
            a.target = "_blank";
            a.innerHTML = element.at;
            div.appendChild(where);
            div.appendChild(cost);
            li.appendChild(span);
            li.appendChild(div);
            ul.appendChild(li);
        });
    }
}