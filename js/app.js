let app = {
    key: "giftr-hass0302"
    , currentContact: -1
};
let data;
document.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem(app.key);
    getProfiles();
});
window.addEventListener('push', function (ev) {
    let content = ev.currentTarget.document.querySelector(".table-view");
    let id = content.id;
    switch (id) {
    case "contact-list":
        DisplayList(0);
        break;
    case "gift-list":
        DisplayList(1);
        break;
    default:
        window.location.href("index.html");
        console.log(id);
        DisplayList(0);
    }
});
document.querySelector("#addPersonBtn").addEventListener("touchend", function () {
    app.currentContact = -1;
    let modal = document.getElementById("personModal");
    personModalScreen();
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
    let errorFlagName, errorFlagDate = true;
    // console.log(modal);
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

function cancelCheck() {
    let modal = document.getElementById("personModal");
    let cancelBtn = modal.getElementsByTagName("button")[0];
    console.log("cancel button");
    modal.classList.toggle("active");
    app.currentContact = -1;
    inputDate.value = "";
    inputName.value = "";
    cancelBtn.removeEventListener("touchstart", cancelCheck);
}

function saveCheck() {
    let modal = document.getElementById("personModal");
    let saveBtn = modal.getElementsByTagName("button")[1];
    console.log("save button");
    if (app.currentContact >= 0) {
        data.people[app.currentContact].name = inputName.value;
        data.people[app.currentContact].dob = inputDate.value;
        saveBtn.removeEventListener("touchstart", saveCheck);
    }
    else {
        data.people.push({
            "name": inputName.value
            , "dob": inputDate.value
            , "id": Date.now()
            , "ideas": []
        });
    }
    console.log(modal.className);
    modal.classList.toggle("active");
    inputDate.value = "";
    inputName.value = "";
    app.currentContact = -1;
    console.dir(data.people);
    DisplayList(0);
    saveBtn.removeEventListener("touchstart", saveCheck);
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
            a2.addEventListener("touchstart", function (ev) {
                console.log(ev.currentTarget.lastElementChild);
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
        let ul = document.getElementById("gift-list");
        ul.innerHTML = "";
        data.people[0].ideas.forEach(function (element) {
            let li = document.createElement("li");
            let a = document.createElement('a');
            let span = document.createElement('span');
            let div = document.createElement('div');
            let where = document.createElement('p');
            let cost = document.createElement('p');
            li.className += "table-view-cell media";
            span.className = "pull-right icon icon-trash midline";
            div.className += "media-body";
            div.innerHTML += element.idea;
            where.appendChild(a);
            cost.innerHTML = element.cost;
            a.href = element.url;
            a.target = "_blank";
            a.innerHTML = element.at;
            div.appendChild(where);
            div.appendChild(cost);
            li.appendChild(span);
            li.appendChild(div);
            //    console.log(li);
            ul.appendChild(li);
        });
    }
}